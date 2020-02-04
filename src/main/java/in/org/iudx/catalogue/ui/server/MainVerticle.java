package in.org.iudx.catalogue.ui.server;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import java.util.logging.Logger;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Promise;
import io.vertx.core.http.ClientAuth;
import io.vertx.core.http.HttpServer;
import io.vertx.core.http.HttpServerOptions;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.core.net.JksOptions;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.StaticHandler;


public class MainVerticle extends AbstractVerticle {

  private static final Logger logger = Logger.getLogger(MainVerticle.class.getName());

  static final int PORT = 8443;
  static String keystore;
  static String keystorePassword;
  Router router;
  
  @Override
  public void start(Promise<Void> startPromise) throws Exception {

    Router router = defineApiRouting();
    
    InputStream input = null;
    
    try {
    	
    	Properties prop = new Properties();
        input = new FileInputStream("config.properties");
        prop.load(input);

        keystore 	=	prop.getProperty("keystore");
        keystorePassword = prop.getProperty("keystorePassword");
    
    } catch (IOException ex) {
        ex.printStackTrace();
    } finally {
        if (input != null) {
            try {
                input.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    
    HttpServer server = createServer();
    server.requestHandler(router).listen(PORT);
    logger.info("API Server Verticle started!");
    startPromise.complete();
    
  }
  

  private HttpServer createServer() {
    ClientAuth clientAuth = ClientAuth.REQUEST;
    
    HttpServer server =
        vertx.createHttpServer(
            new HttpServerOptions()
                .setSsl(true)
                .setClientAuth(clientAuth)
                .setTrustStoreOptions(new JksOptions().setPath(keystore).setPassword(keystorePassword))
                .setKeyStoreOptions(
                    new JksOptions().setPath(keystore).setPassword(keystorePassword)));
    return server;
  }
  
  private void serveFile(String url, String indexHTMLFilePath) {
	  this.router
		  .route(url)
		    .handler(
		        routingContext -> {
		          HttpServerResponse response = routingContext.response();
		          response.sendFile(indexHTMLFilePath);
		        });
  }

  private Router defineApiRouting() {
    this.router = Router.router(vertx);
    this.router.route().handler(BodyHandler.create());

    //  Routes intended for providers starts with /p/
    this.serveFile("/p/dashboard", "ui/pages/dashboard/index.html");

    //  Routes intended for consumers starts with /c/
    this.serveFile("/c/", "ui/pages/list/index.html");
    this.serveFile("/c/map", "ui/pages/map/index.html");
    
    //  Routes intended for providers and consumers
    this.serveFile("/", "ui/pages/landing/index.html");
    this.serveFile("/status", "ui/pages/status/index.html");
    this.serveFile("/internal_apis/status-response", "response.json");

    //router.route("/*").handler(StaticHandler.create("ui/pages"));
    this.router.route("/assets/*").handler(StaticHandler.create("ui/assets"));
    return this.router;
  }

}
