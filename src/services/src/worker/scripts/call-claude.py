import requests
import json

# todo use js lib instead https://github.com/Explosion-Scratch/claude-unofficial-api 
# ! todo get sessionKey from env
sessionKey = ''

def get_organizations():
    headers = {
        'common': 'Accept: application/json, text/plain, */*',
        'cookie': f'sessionKey={sessionKey}',
        'content-type': 'application/json',
        'Accept': 'application/json',
        'Connection': 'close',
        'User-Agent': 'RapidAPI/4.2.0 (Macintosh; OS X/13.0.1) GCDHTTPRequest',
    }
    
    try:
        response = requests.get("https://claude.ai/api/organizations", headers=headers)
        response.raise_for_status()  # raise exception if invalid response
        data = response.json()

    except requests.exceptions.HTTPError as errh:
        print(f"HTTP Error: {errh}")
        data = {'error': 'HTTP Error'}

    except requests.exceptions.ConnectionError as errc:
        print(f"Error Connecting: {errc}")
        data = {'error': 'Connection Error'}

    except requests.exceptions.Timeout as errt:
        print(f"Timeout Error: {errt}")
        data = {'error': 'Timeout Error'}

    except requests.exceptions.RequestException as err:
        print(f"General Error: {err}")
        data = {'error': 'General Error'}

    return data

# Call the function and print the results as JSON
result = get_organizations()
print(json.dumps(result))