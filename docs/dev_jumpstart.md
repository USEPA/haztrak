## quickstart 4/13/2022
i've reverted back to using the default sqlite3 database. When you start the project, it will be created automatically. 
I also reorganized the project to follow best practices, namely moving the django "apps" into a new "apps" directory. 

## steps to get up a running locally
1. Need python and pip
2. clone the repo, or your fork
```
$ git clone git@github.com:dpgraham4401/haztrak.git
``` 
or 
```
$ git clone https://github.com/dpgraham4401/dpgraham.git
```
3. create a virtual environment, you'll need to be able to create virtual environments (I know you guys aren't dumb, jsut tryign to cover all the bases)
```
$ python -m venv <name_of_venv_directory>
```
4. activate the virtual environment
```
$ source <name_of_venv_directory>/Scripts/activate
```
4a. If using Windows Command Prompt / Powershell
```
$ .\<name_of_venv_directory>\Scripts\activate
```
5. install dependencies
```
$ pip install -r requirements.txt
```
6. run the server and navigate go to [127.0.0.1](http://127.0.0.1) in your favorite browser
```
$ python manage.py runserver
```

## Other things you may want to do
1. [run your migration](https://docs.djangoproject.com/en/4.0/topics/migrations/)
 to the sqlite db ```python manage.py makemigrations``` and ```python manage.py migrate```
2. create a superuser to use the django admin page [127.0.0.1/admin](http://127.0.0.1/admin)
``` python manage.py createsuperuser ```
if you get an error about not using a TTY, try ```wintpy python manage.py createsuperuser```
