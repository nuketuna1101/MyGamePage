from flask import Flask, render_template, jsonify, request
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import threading

import time
import base64

app = Flask(__name__)

client = MongoClient('localhost', 27017)        # mongoDB: 27017번 포트
db = client.myGameDB                            # 


#####################################################################################
# Flask 의 jsonify 호출시 ObjectId의 _id 필드 문제 야기
# JsonEncoder를 Custom encoder로 대체하여 ObjectId 타입에 대해서만 직접 처리, 나머지는 위임
from bson import ObjectId
from flask.json.provider import JSONProvider
import json
class CustomJSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)
class CustomJSONProvider(JSONProvider):
    def dumps(self, obj, **kwargs):
        return json.dumps(obj, **kwargs, cls=CustomJSONEncoder)

    def loads(self, s, **kwargs):
        return json.loads(s, **kwargs)

app.json = CustomJSONProvider(app)
# #####################################################################################

# 기본 루트
@app.route('/')
def home():
    return render_template('index.html')

# DB 내의 게임 목록 GET으로 가져오기
@app.route('/items', methods=['GET'])
def get_items():
    # 요청한 sort방식 가져오기 .. 없다면 기본값으로 알파벳 순
    filterMode = request.args.get('filterMode', 'alphabet')

    if filterMode == 'alphabet':
        items = list(db.items.find().sort("title", 1))
    elif filterMode == 'likes':
        items = list(db.items.find().sort("likes", 1))
    elif filterMode == 'bookmark':
        items = list(db.items.find({'bookmark': True}))
    else:
        return jsonify({'result': 'failure'})
    
    return jsonify({'result': 'success', 'item_list': items})

# 좋아요 버튼으로 좋아요 개수 올리기. TODO!!!!!!!!!!!!
@app.route('/likes', methods=['POST'])
def like_items():
    return jsonify({'result': 'success'})

@app.route('/bookmark', methods=['POST'])
def toggle_Bookmark():
    targetID = request.form.get('targetID', 'wrong')
    target = db.items.find_one({'id':targetID}, {'bookmark':1})
    toggledValue = not target['bookmark']
    db.items.update_one({'id':targetID}, {'$set': {'bookmark' : toggledValue}})    
    isBookmarked = db.items.find_one({'id':targetID}, {'bookmark':1})['bookmark']
    return jsonify({'result': 'success', 'isBookmarked': isBookmarked})


@app.route("/search", methods=['GET'])
def search_on_google():
    query = request.args.get('title', 'wrong')
    # 비동기 실행보장
    search_thread = threading.Thread(target=search_on_google_async, args=(query,))
    search_thread.start()
    return jsonify({'result': 'success'})

def search_on_google_async(query):
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    driver.get("https://www.google.com/")
    search_box = driver.find_element(By.NAME, "q")
    search_box.send_keys(query)
    search_box.send_keys(Keys.RETURN)
    time.sleep(10)
    driver.quit()


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
    for item in db.list_collections:
        print(item)