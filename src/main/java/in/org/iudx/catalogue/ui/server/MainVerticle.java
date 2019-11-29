package in.org.iudx.catalogue.ui.server;

import java.util.logging.Logger;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Promise;
import io.vertx.core.http.HttpServer;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.StaticHandler;


public class MainVerticle extends AbstractVerticle {

  private static final Logger logger = Logger.getLogger(MainVerticle.class.getName());

  static final int PORT = 8443;
  
  @Override
  public void start(Promise<Void> startPromise) throws Exception {

    Router router = defineApiRouting();
    HttpServer server = createServer();
    server.requestHandler(router).listen(PORT);
    logger.info("API Server Verticle started!");
    startPromise.complete();
    
  }

  private HttpServer createServer() {
    HttpServer server = vertx.createHttpServer();
    return server;
  }

  private Router defineApiRouting() {
    Router router = Router.router(vertx);
    router.route().handler(BodyHandler.create());

    router
    .route("/")
    .handler(
        routingContext -> {
          HttpServerResponse response = routingContext.response();
          response.sendFile("ui/pages/list/index.html");
        });

    router
        .route("/map")
        .handler(
            routingContext -> {
              HttpServerResponse response = routingContext.response();
              response.sendFile("ui/pages/map/index.html");
            });

    //router.route("/*").handler(StaticHandler.create("ui/pages"));
    router.route("/assets/*").handler(StaticHandler.create("ui/assets"));
    return router;
  }

}
