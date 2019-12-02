# iudx-ui-server
This is the UI server for connecting to various IUDX entities like CAT, AUTH and RS made using Vert.x, an event driven and non-blocking high performance reactive framework.

Quickstart
========== 

#. Clone the repository::

    git clone https://github.com/iudx/iudx-ui-server
    cd iudx-ui-server

#. Please install the following dependencies manually, skip if already installed

	- docker
	- docker-compose
    
#. Please insert the password corresponding to the **.jks** file (used in production) in **config.properties** file. If not done then server won't start.


#. Start the installation::

    cd docker
    sh install
    
Catalogue will be up in production mode at <https://localhost>
