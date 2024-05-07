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
            'id': 'g01',
            'title': 'Hearthstone',
            'img': 'static/img/Hearthstone.jpg',
            'likes': random.randrange(10, 50),
            'bookmark': False,
        },
        {
            'id': 'g02',
            'title': 'League of Legends',
            'img': 'static/img/LeagueofLegends.jpg',
            'likes': random.randrange(10, 50),
            'bookmark': False,
        },
        {
            'id': 'g03',
            'title': 'Battleground',
            'img': 'static/img/Battleground.jpg',
            'likes': random.randrange(10, 50),
            'bookmark': False,
        },
        {
            'id': 'g04',
            'title': 'Lies of P',
            'img': 'static/img/LiesofP.jpg',
            'likes': random.randrange(10, 50),
            'bookmark': False,
        },
        {
            'id': 'g05',
            'title': 'Dave the Diver',
            'img': 'static/img/DavetheDiver.jpg',
            'likes': random.randrange(10, 50),
            'bookmark': False,
        },
    ]
    for data in init_data:
        db.items.insert_one(data)


if __name__ == '__main__':
    # 기존 db 데이터 삭제 후 초기화
    init_db()