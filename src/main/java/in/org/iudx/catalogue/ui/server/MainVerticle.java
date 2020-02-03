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

  private Router defineApiRouting() {
    Router router = Router.router(vertx);
    router.route().handler(BodyHandler.create());

    router
    .route("/c/")
    .handler(
        routingContext -> {
          HttpServerResponse response = routingContext.response();
          response.sendFile("ui/pages/list/index.html");
        });

    router
        .route("/c/map")
        .handler(
            routingContext -> {
              HttpServerResponse response = routingContext.response();
              response.sendFile("ui/pages/map/index.html");
            });
    router
        .route("/c/status")
        .handler(
            routingContext -> {
              HttpServerResponse response = routingContext.response();
              response.sendFile("ui/pages/status/index.html");
            });
    router
        .route("/internal_apis/status-response")
        .handler(
            routingContext -> {
              HttpServerResponse response = routingContext.response();
              response.sendFile("response.json");
            });

    //router.route("/*").handler(StaticHandler.create("ui/pages"));
    router.route("/assets/*").handler(StaticHandler.create("ui/assets"));
    return router;
  }

}
