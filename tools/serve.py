#!/usr/bin/env python3
"""Lokalni pregled stranica.

    python3 tools/serve.py          pa otvori http://localhost:8731/optin/

Obican `python3 -m http.server` servira bez podatka o kodiranju, pa se
kvacice prikazu kao `UÅ½IVO`. Ovaj servis uvek salje charset=utf-8.
"""

import functools
import http.server
import os
import socketserver
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8731
KOREN = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def guess_type(self, path):
        tip = super().guess_type(path)
        if tip in ('text/html', 'text/css', 'application/javascript', 'text/plain'):
            return tip + '; charset=utf-8'
        return tip

    def log_message(self, *args):
        pass


if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(
            ('', PORT), functools.partial(Handler, directory=KOREN)) as s:
        print('Stranice su na:')
        print('   http://localhost:%d/optin/' % PORT)
        print('   http://localhost:%d/application.html?firstname=Ana' % PORT)
        print('   http://localhost:%d/thankyou.html?firstname=Ana&email=ana@gmail.com' % PORT)
        print('\nCtrl+C za kraj.')
        try:
            s.serve_forever()
        except KeyboardInterrupt:
            print()
