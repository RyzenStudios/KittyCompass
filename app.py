import requests

def search_cats(location):
    api_key = 'V7B0Ayv0D0da6XoqqvwafQLA3kN9aBX9TWF1exN9LiP5MTQmZo'
    
    try:
        response = requests.get(
            f'https://api.petfinder.com/v2/animals?type=cat&location={location}',
            headers={'Authorization': f'Bearer {api_key}'}
        )
        data = response.json()

        print(data['animals'])

    except Exception as e:
        print("Erorr: ", e)
search_cats("Toronto")