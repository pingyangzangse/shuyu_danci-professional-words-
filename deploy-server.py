#!/usr/bin/env python3
# 把最新 index.html 同步到阿里云服务器（danci-professional-words.alaric.wiki）
# 用法：PYTHONPATH=../.pylibs python3 deploy-server.py
# 依赖：paramiko；密码从 DeepTalk knowledge-share 项目的 .env 读取（KMS_DEPLOY_PASSWORD）
import os, sys, paramiko

KS = '/Users/alaric/Desktop/AI项目/deep talk/代码仓库/knowledge-share'
HERE = os.path.dirname(os.path.abspath(__file__))

pwd = None
for line in open(os.path.join(KS, '.env')):
    if line.startswith('KMS_DEPLOY_PASSWORD='):
        pwd = line.strip().split('=', 1)[1]
if not pwd:
    sys.exit('未找到 KMS_DEPLOY_PASSWORD')

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('120.79.99.1', username='root', password=pwd, timeout=15)
sftp = client.open_sftp()
sftp.put(os.path.join(HERE, 'index.html'), '/root/shuyu-flashcards/index.html')
sftp.close()
stdin, stdout, stderr = client.exec_command(
    'curl -s -o /dev/null -w "%{http_code}" https://danci-professional-words.alaric.wiki/ --resolve danci-professional-words.alaric.wiki:443:127.0.0.1')
print('线上状态:', stdout.read().decode())
client.close()
print('已同步到 https://danci-professional-words.alaric.wiki/')
