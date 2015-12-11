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
    page = urllib2.urlopen(req).read()
    return page

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
    return urlparse.urlparse(url).scheme != ""

def add_urls():
    def indexpage_callback(tag, p):
        name = tag.text.strip()
        if name == "Api":
            path = tag.attrs['href'].strip()
            page = request_file(os.path.join(docset_path, path))
            find_anchorpoint(page, 'div', {'class': 'cls'}   , apipage_guide_callback, {'path': path})
            find_anchorpoint(page, 'div', {'class': 'method'}, apipage_func_callback , {'path': path})
        elif name == "NetEase Pomelo":
            url = tag.attrs['href'].strip()
            page = request_url(url)
            find_anchorpoint(page, 'div', {'class': 'markdown-body'}, neteasepage_callback, {})
        elif len(name) > 0:
            path = tag.attrs['href'].strip()
            page = request_file(os.path.join(docset_path, path))
            find_anchorpoint(page, 'h1', {}, wikipage_callback, {'path': path})

    def apipage_guide_callback(tag, p):
        name = tag['id']
        if len(name) > 0:
            update_db(name, 'Guide', p['path']+'#'+name)
    def apipage_func_callback(tag, p):
        name = tag['id']
        if len(name) > 0:
            update_db(name, 'func', p['path']+'#'+name)

    def wikipage_callback(tag, p):
        p['name'] = tag.text.strip()
        find_anchorpoint(tag, 'a', {'class': 'anchor'}, wikipage_tag_callback, p)
    def wikipage_tag_callback(tag, p):
        anchor = tag['id']
        if len(anchor) > 0:
            update_db(p['name'], 'Guide', p['path']+'#'+uriencode(anchor))

    def neteasepage_callback(tag, p):
        any = re.compile('^[^/h]')
        find_anchorpoint(tag, 'a', {'href': any}, neteasepage_tag_callback, p)
    def neteasepage_tag_callback(tag, p):
        name = tag.text.strip()
        if len(name) > 0:
            url = tag.attrs['href'].strip()
            page = request_url("https://github.com/NetEase/pomelo/wiki/"+url)
            if len(page) > 0:
                soup = find_anchorpoint(page, 'h1', {}, neteasesubpage_callback, {'url': url})
                for link in soup.findAll('a'):
                    link['href'] = ""
                with open(source_dir+"/wiki/"+uridecode(url)+".html","w") as f:
                    f.write(soup.renderContents())
    def neteasesubpage_callback(tag, p):
        p['name'] = tag.text.strip()
        find_anchorpoint(tag, 'a', {'class': 'anchor'}, neteasesubpage_tag_callback, p)
    def neteasesubpage_tag_callback(tag, p):
        anchor = tag['id']
        if len(anchor) > 0:
            update_db(p['name'], 'Guide', "wiki/"+p['url']+'.html#'+uriencode(anchor))

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
