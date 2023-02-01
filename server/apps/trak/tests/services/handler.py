import requests
import responses


@responses.activate
def test_responses_library():
    with responses.RequestsMock() as mock:
        # Define the mock response
        base_url = 'https://rcrainfopreprod.epa.gov/rcrainfo/rest/'

        mock.add(responses.GET, f'{base_url}',
                 json={'key': 'value'}, status=200)

        # Make the request
        response = requests.get(f'{base_url}')

        # Assert that the request was made correctly
        assert response.json() == {'key': 'value'}
        assert response.status_code == 200
