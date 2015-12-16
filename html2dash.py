#! /usr/bin/env python
# -*- coding: utf-8 -*-

import argparse
import os
import re
import urllib
import urllib2
import urlparse
import sqlite3
import subprocess
import md5
import bs4
from bs4 import BeautifulSoup

def update_db(name, tag, path):
    cur.execute("SELECT rowid FROM searchIndex WHERE path = ?", (path,))
    dbpath = cur.fetchone()
    cur.execute("SELECT rowid FROM searchIndex WHERE name = ?", (name,))
    dbname = cur.fetchone()

    if dbpath is None and dbname is None:
        cur.execute('INSERT OR IGNORE INTO searchIndex(name, type, path)\
                VALUES (?,?,?)', (name, tag, path))
    else:
        pass

def request_url(url):
    req = urllib2.Request(url)
    try:
        page = urllib2.urlopen(req)
    except urllib2.HTTPError, e:
        # print e.fp.read()
        print "url: "+url+" request failed"
        return ""

    content = page.read()
    return content

def request_file(path):
    page = open(path).read()
    return page

def uriencode(uri):
    if isinstance(uri, unicode):
        uri = uri.encode("utf-8")
    if isinstance(uri, str):
        return urllib.quote(uri)
    return uri

def uridecode(uri):
    if isinstance(uri, unicode):
        uri = uri.encode("utf-8")
    if isinstance(uri, str):
        return urllib.unquote(uri)
    return uri

def find_anchorpoint(soup, node, attrs, callback, p):
    if isinstance(soup, unicode) or isinstance(soup, str):
        soup = BeautifulSoup(soup, "html.parser")
    for tag in soup.find_all(node, attrs):
        callback(tag, p)
    return soup

def isurl(url):
    return urlparse.urlparse(url).scheme != "" or url.startswith("//")

def fixurl(url, pageurl):
    if url.startswith("/"):
        urlinfo = urlparse.urlparse(pageurl)
        rooturl = urlinfo.scheme+"://"+urlinfo.netloc
        return rooturl+'/'+url
    elif url.startswith("//"):
        return "http:"+url
    elif isurl(url):
        return url
    else:
        urlsplit = pageurl.split('/')
        urlsplit.pop()
        pageurl = '/'.join(urlsplit)
        return pageurl+'/'+url

def isdomain(url, domain):
    return urlparse.urlparse(url).netloc == domain

def isresource(url):
    path = urlparse.urlparse(url).path
    ext = path.split('.')[-1]
    ext = ext.split('?')[0]
    extension = "css?js?png?jpg?jpeg?bmp?gif?"
    if ext in extension:
        return True
    return False

def saveres(soup, pageurl, tag, savepath):
    # get valided pageurl
    src = fixurl(soup.attrs[tag].strip(), pageurl)

    # only download resource file
    if isresource(src):
        # use md5(valided pageurl) create newfile
        ext = src.split('?')[0].split('.')[-1]
        filename = md5.new(src).hexdigest()+"."+ext

        # create src dir
        savedir = os.path.dirname(savepath+"src")
        if not os.path.exists(savedir):
            os.makedirs(savedir)

        # check already downloaded
        if not os.path.isfile(savepath+"src/"+filename):
            res = request_url(src)
            if len(res)>0:
                # filename = md5.new(res).hexdigest()+"."+ext
                with open(savepath+"src/"+filename,"w") as f:
                    f.write(res)
        # replace pageurl to local pageurl
        soup[tag] = "src/"+filename

# pull head, pull subdiv as body
def pulldiv(url, pullfunc):
    soup = BeautifulSoup(request_url(url), "html.parser")
    newsoup = BeautifulSoup("<html><body></body></html>", "html.parser")
    newsoup.html.body.insert_before(soup.head)
    subsoup = pullfunc(soup)
    newsoup.html.body.append(subsoup)
    return newsoup

def add_urls():
    any = re.compile('.*')
    # deal pageurl
    def indexpage_callback(indexsoup, p):
        name = indexsoup.text.strip()
        url = indexsoup.attrs['originhref'].strip()
        urlinfo = urlparse.urlparse(url)
        rooturl = urlinfo.scheme+"://"+urlinfo.netloc

        # first deal single page
        single_page = False
        if urlinfo.netloc=="www.infoq.com":
            def pullfunc(soup):
                return soup.find("div", {"class": "article_page_left"})
            single_page = pulldiv(url, pullfunc)
        elif urlinfo.netloc=="www.cocoachina.com":
            def pullfunc(soup):
                return soup.find("div", {"id": "detailbody"})
            single_page = pulldiv(url, pullfunc)
        elif urlinfo.netloc=="linux.cn":
            def pullfunc(soup):
                return soup.find("div", {"id": "article_content"}).find_previous("div", {"class": "vw"})
            single_page = pulldiv(url, pullfunc)
        elif urlinfo.netloc=="yueliangdao0608.blog.51cto.com":
            def pullfunc(soup):
                return soup.find("div", {"class": "showContent"})
            single_page = pulldiv(url, pullfunc)
        elif urlinfo.netloc=="archboy.org":
            def pullfunc(soup):
                return soup
            single_page = pulldiv(url, pullfunc)

        # is single webpage
        if single_page:
            # single page has tag
            tag = indexsoup.attrs['tag'].strip()

            # remove all <base/>
            for soup in single_page.find_all("base"):
                soup.unwrap()

            # save images, js, css
            for soup in single_page.find_all(src=any):
                saveres(soup, url, 'src', source_dir+'/page/')
            for soup in single_page.find_all('link', {'href': any}):
                saveres(soup, url, 'href', source_dir+'/page/')

            # save page
            with open(source_dir+"/page/"+name+".html","w") as f:
                f.write(single_page.renderContents())

            # insert into table
            update_db(name+" - "+tag, 'Guide', 'page/'+uriencode(name+".html"))
            indexsoup['href'] = "page/"+uriencode(name+".html")
            print "page: "+name+".html down!"
        elif docset_name=="Pomelo.wiki.docset" and name == "Api":
            # offline page
            page = request_file(os.path.join(source_dir, url))

            def apipage_callback(soup, p):
                name = soup['id']
                if len(name) > 0:
                    update_db(name+" - api", tag, url+'#'+name)

            tag = 'Guide'
            find_anchorpoint(page, 'div', {'class': 'cls'}   , apipage_callback, p)
            tag = 'func'
            find_anchorpoint(page, 'div', {'class': 'method'}, apipage_callback, p)

        elif docset_name=="Pomelo.wiki.docset" and name == "NetEase Pomelo":
            def pomelopage_callback(soup, p):
                p['file'] = soup.text.strip()+".html"
                p['fileurl'] = p['rooturl']+soup.attrs['href'].strip()

                # if not os.path.isfile(source_dir+"/wiki/"+p['file']):
                def pullfunc(subsoup):
                    return subsoup.find("div", {"id": "wiki-body"})

                pagesoup = pulldiv(p['fileurl'], pullfunc)
                pagesoup.body['style'] = "padding:0 25px;"

                find_anchorpoint(pagesoup, 'a', {'class': 'anchor'}, pomelopage_tag_callback, p)

                for subsoup in pagesoup.find_all(src=any):
                    saveres(subsoup, p['fileurl'], 'src', source_dir+'/wiki/')
                for subsoup in pagesoup.find_all('link', {'href': any}):
                    saveres(subsoup, p['fileurl'], 'href', source_dir+'/wiki/')

                with open(source_dir+"/wiki/"+p['file'],"w") as f:
                    f.write(pagesoup.renderContents())

                soup['href'] = uriencode(p['file'])
                print "page: "+p['file']+" down!"

            def pomelopage_tag_callback(tag, p):
                soup = tag.find_parent()
                name = soup.text.strip()
                anchor = tag['id']

                if len(anchor) > 0:
                    update_db(name+" - wiki", 'Guide', 'wiki/'+uriencode(p['file'])+'#'+uriencode(anchor))

            page = request_url(url)
            pagesoup = find_anchorpoint(page, 'a', {'class': 'wiki-page-link'}, pomelopage_callback, {'rooturl': rooturl, 'indexurl': url})

            with open(source_dir+"/wiki/"+name+".html","w") as f:
                f.write(pagesoup.renderContents())

            indexsoup['href'] = "wiki/"+uriencode(name+".html")

        elif docset_name=="Python.wiki.docset" and (name=="BeautifulSoup" or name.encode("utf-8")=="BeautifulSoup 汉化"):
            page = request_file(os.path.join(source_dir, url))

            def bspage_callback(soup, p):
                name = soup.text.strip() + " - BeautifulSoup"
                anchor = soup.attrs['href'].strip()

                if len(anchor) > 0:
                    update_db(name, 'Guide', uriencode(url)+'#'+uriencode(anchor.replace("#","")))

            pagesoup = BeautifulSoup(page, "html.parser").find('div', {'class': 'sphinxsidebarwrapper'})
            find_anchorpoint(pagesoup, 'a', {'class': any, 'href': any}, bspage_callback, {})

        else:
            update_db(name, 'Guide', url)

    # scan sub url
    page = request_file(os.path.join(source_dir, 'index.html'))
    soup = find_anchorpoint(page, 'a', {'originhref': any}, indexpage_callback, {})

    # replace index.html
    with open(os.path.join(source_dir, 'index.html'),"w") as f:
        f.write(soup.renderContents())
    print "docset: "+source_dir+" down!"

def add_infoplist(info_path, index_page):
    name = docset_name.split('.')[0]
    info = """
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
    <dict>
            <key>CFBundleIdentifier</key>
            <string>{0}</string>
            <key>CFBundleName</key>
            <string>{1}</string>
            <key>DashDocSetFamily</key>
            <string>{2}</string>
            <key>DocSetPlatformFamily</key>
            <string>{3}</string>
            <key>isDashDocset</key>
            <true/>
            <key>isJavaScriptEnabled</key>
            <true/>
            <key>dashIndexFilePath</key>
            <string>{4}</string>
    </dict>
    </plist>
    """.format(dir_name, dir_name, name, name, index_page)

    try:
        open(info_path, 'wb').write(info)
        print "Create the Info.plist File"
    except:
        print "**Error**:  Create the Info.plist File Failed..."
        clear_trash()
        exit(2)


def clear_trash():
    try:
        subprocess.call(["rm", "-r", docset_name])
        print "Clear generated useless files!"
    except:
        print "**Error**:  Clear trash failed..."


if __name__ == "__main__":

    parser = argparse.ArgumentParser()

    parser.add_argument('-n', '--name',
                        help='Name the docset explicitly')
    parser.add_argument('-d', '--destination',
                        dest='path',
                        default='',
                        help='Put the resulting docset into PATH')
    parser.add_argument('-i', '--icon',
                        dest='filename',
                        help='Add PNG icon FILENAME to docset')
    parser.add_argument('-p', '--index-page',
                        help='Set the file that is shown')
    parser.add_argument('SOURCE',
                        help='Directory containing the HTML documents')

    results = parser.parse_args()

    source_dir = results.SOURCE
    if source_dir[-1] == "/":
        source_dir = results.SOURCE[:-1]

    if not os.path.exists(source_dir):
        print source_dir + " does not exsit!"
        exit(2)

    dir_name = os.path.basename(source_dir)
    if not results.name:
        docset_name = dir_name + ".docset"
    else:
        docset_name = results.name + ".docset"

    # create docset directory and copy files
    doc_path = docset_name + "/Contents/Resources/Documents"
    dsidx_path = docset_name + "/Contents/Resources/docSet.dsidx"
    icon_path = docset_name + "/icon.png"
    info = docset_name + "/Contents/info.plist"

    destpath = results.path
    if results.path and results.path[-1] != "/":
        destpath += "/"
    docset_path = destpath + doc_path
    sqlite_path = destpath + dsidx_path
    info_path = destpath + info

    # print docset_path, sqlite_path

    if not os.path.exists(docset_path):
        os.makedirs(docset_path)
        print "Create the Docset Folder!"
    else:
        print "Docset Folder already exist!"

    # create and connect to SQLite
    try:
        db = sqlite3.connect(sqlite_path)
        cur = db.cursor()
    except:
        print "**Error**:  Create SQLite Index Failed..."
        clear_trash()
        exit(2)

    try:
        cur.execute('DROP TABLE searchIndex;')
    except:
        pass

    cur.execute('CREATE TABLE searchIndex(id INTEGER PRIMARY KEY,\
                name TEXT,\
                type TEXT,\
                path TEXT);')
    cur.execute('CREATE UNIQUE INDEX anchor ON searchIndex (name, type, path);')
    print "Create the SQLite Index"

    add_urls()
    db.commit()
    db.close()

    # Copy the HTML Documentation to the Docset Folder
    try:
        subprocess.call(["cp", "-r", results.SOURCE + "/", docset_path])
        print "Copy the HTML Documentation!"
    except:
        print "**Error**:  Copy Html Documents Failed..."
        clear_trash()
        exit(2)

    # Create the Info.plist File
    if not results.index_page:
        index_page = "index.html"
    else:
        index_page = results.index_page

    add_infoplist(info_path, index_page)

    # Add icon file if defined
    icon_filename = results.filename
    if icon_filename:
        if icon_filename[-4:] == ".png" and os.path.isfile(icon_filename):
            try:
                subprocess.call(["cp", icon_filename, icon_path])
                print "Create the Icon for the Docset!"
            except:
                print "**Error**:  Copy Icon file failed..."
                clear_trash()
                exit(2)
        else:
            print "**Error**:  Icon file should be a valid PNG image..."
            clear_trash()
            exit(2)
    else:
        pass

    print "Generate Docset Successfully!"
