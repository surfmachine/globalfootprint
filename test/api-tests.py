import requests
import json

s = requests.Session()
s.headers.update({'referer': 'http://data.footprintnetwork.org/'})
resp = s.get('https://api.footprintnetwork.org/v1/data/all/2016/earth')

print(resp)
print(resp.content)

jcontent = resp.content.decode('UTF-8')
content  = json.loads(jcontent)

sample = content[0]
print(sample)

print("----------------------------------------")

for rec in content:
    print(rec['countryCode'], ":", rec['isoa2'], ":", rec['shortName'], ":", rec['countryName'])

print("Total records:", len(content))