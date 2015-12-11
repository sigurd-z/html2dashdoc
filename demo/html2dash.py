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
    try:
        cur.execute("SELECT rowid FROM searchIndex WHERE path = ?", (path,))
        dbpath = cur.fetchone()
        cur.execute("SELECT rowid FROM searchIndex WHERE name = ?", (name,))
        dbname = cur.fetchone()

        if dbpath is None and dbname is None:
            cur.execute('INSERT OR IGNORE INTO searchIndex(name, type, path)\
                    VALUES (?,?,?)', (name, tag, path))
        else:
            pass
    except:
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
        soup = BeautifulSoup(soup)
    for tag in soup.find_all(node, attrs):
        callback(tag, p)
    return soup

def isurl(url):
    return urlparse.urlparse(url).scheme != "" or url.startswith("//")

def fixurl(url, domain):
    if url.startswith("//"):
        return "http:"+url
    elif isurl(url):
        return url
    else:
        return domain+"/"+url

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

def saveres(soup, rooturl, tag, savepath):
    src = fixurl(soup.attrs[tag].strip(), rooturl)
    if isresource(src):
        ext = src.split('?')[0].split('.')[-1]
        filename = md5.new(src).hexdigest()+"."+ext
        if not os.path.isfile(savepath+"src/"+filename):
            res = request_url(src)
            if len(res)>0:
                # filename = md5.new(res).hexdigest()+"."+ext
                with open(savepath+"src/"+filename,"w") as f:
                    f.write(res)
        soup[tag] = "src/"+filename

def add_urls():

    def indexpage_callback(tag, p):
        name = tag.text.strip()
        url = tag.attrs['href'].strip()
        urlinfo = urlparse.urlparse(url)
        rooturl = urlinfo.scheme+"://"+urlinfo.netloc
        tag = tag.attrs['tag'].strip()
        soup = BeautifulSoup(request_url(url))
        for basesoup in soup.find_all("base"):
            basesoup.unwrap()
        if urlinfo.netloc=="domain.com":
            newsoup = BeautifulSoup("<html><body></body></html>")
            newsoup.html.body.insert_before(soup.head)
            subsoup = soup.find("div", {"id": "idname"}).find_previous("div", {"class": "classname"})
            newsoup.html.body.append(subsoup)
            soup = newsoup
        for subsoup in soup.find_all(src=any):
            saveres(subsoup, rooturl, 'src', source_dir+'/page/')
        for subsoup in soup.find_all('link', {'href': any}):
            saveres(subsoup, rooturl, 'href', source_dir+'/page/')
        with open(source_dir+"/page/"+name+".html","w") as f:
            f.write(soup.renderContents())
        update_db(name+" - "+tag, 'Guide', 'page/'+uriencode(name+".html"))

    page = request_file(os.path.join(docset_path, 'index.html'))
    any = re.compile('.*')
    find_anchorpoint(page, 'a', {'href': any}, indexpage_callback, {})

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

    # Copy the HTML Documentation to the Docset Folder
    try:
        subprocess.call(["cp", "-r", results.SOURCE + "/", docset_path])
        print "Copy the HTML Documentation!"
    except:
        print "**Error**:  Copy Html Documents Failed..."
        clear_trash()
        exit(2)

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
