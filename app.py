from flask import Flask, render_template, jsonify, request
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

import time
import base64


app = Flask(__name__)

client = MongoClient('localhost', 27017)        # mongoDB: 27017번 포트
db = client.myGameDB                            # 

# 기본
@app.route('/')
def home():
    return render_template('index.html')

# DB 내의 게임 목록 GET으로 가져오기
@app.route('/games', methods=['GET'])
def get_items():
    # 요청한 sort방식 가져오기 .. 없다면 기본값으로 좋아요 순
    sortBy = request.args.get('sortBy', 'likes')


    # 1. db에서 game 목록 검색 후 주어진 sortBy로 정렬 .. 참고) find({},{}), sort()를 활용하면 됨.
    #      개봉일 순서 정렬처럼 여러 기준으로 순서대로 정렬해야되는 경우 sort([('A', 1), ('B', 1)]) 처럼 줄 수 있음.
    #    TODO: 다음 코드에서 likes로 정렬이 정상동작하도록 직접 수정해보세요!!!

    if sortBy == 'likes':
        games = list(db.games.find())
    else:
        return jsonify({'result': 'failure'})


    return jsonify({'result': 'success'})

# 좋아요 버튼으로 좋아요 개수 올리기.
@app.route('/games', methods=['POST'])
def like_items():
    return jsonify({'result': 'success'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
    for item in db.list_collections:
        print(item)




# def get_first_image_from_google(query):

#     driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
#     driver.get("https://www.google.com/imghp")

#     # 검색 입력 상자를 찾고 검색어 입력
#     search_box = driver.find_element(By.NAME, "q")
#     search_box.send_keys(query)
#     search_box.send_keys(Keys.RETURN)

#     # 페이지 로딩을 위해 잠시 대기
#     time.sleep(3)
#     # 이미지 결과 가져오기
#     # first_image = driver.find_element(By.XPATH, "//div[@class='islrc']//img")
#     first_image = driver.find_element(By.XPATH, "//*[@id='dimg_11']")
#     image_url = first_image.get_attribute("src")

#     print(image_url)
#     img_data=image_url.split('base64,')[1].encode('utf8')
#     with open("imageToSave.gif", "wb") as fh:
#         fh.write(base64.decodebytes(img_data))

#     # WebDriver 종료
#     driver.quit()

#     return image_url

# # 사용자 입력 받기
# my_query = input("검색어를 입력하세요: ")
# # 검색어를 이용하여 첫 번째 이미지 가져오기
# first_image_url = get_first_image_from_google(my_query)
# print("첫 번째 이미지 URL:", first_image_url)