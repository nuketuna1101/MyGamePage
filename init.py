# init.py
# :: 데이터 베이스 내의 자료 초기화
from flask import Flask, render_template, jsonify, request
from pymongo import MongoClient
import random

app = Flask(__name__)

client = MongoClient('localhost', 27017)        # mongoDB: 27017번 포트
db = client.myGameDB                            # 

def init_db():
    db.items.drop()
    init_data = [
        {
            'title': 'Hearthstone',
            # 'img': img_url,
            'likes': random.randrange(10, 50),
            'bookmark': False,
        },
        {
            'title': 'League of Legends',
            # 'img': img_url,
            'likes': random.randrange(10, 50),
            'bookmark': False,
        },
        {
            'title': 'Battleground',
            # 'img': img_url,
            'likes': random.randrange(10, 50),
            'bookmark': False,
        },
        {
            'title': 'Lies of P',
            # 'img': img_url,
            'likes': random.randrange(10, 50),
            'bookmark': False,
        },
        {
            'title': 'Dave the Diver',
            # 'img': img_url,
            'likes': random.randrange(10, 50),
            'bookmark': False,
        },
    ]
    for data in init_data:
        db.items.insert_one(data)


if __name__ == '__main__':
    # 기존 db 데이터 삭제 후 초기화
    init_db()