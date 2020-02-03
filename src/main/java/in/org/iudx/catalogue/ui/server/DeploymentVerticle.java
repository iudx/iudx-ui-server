package in.org.iudx.catalogue.ui.server;

import java.util.logging.Logger;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Future;

public class DeploymentVerticle extends AbstractVerticle {

	  private static final Logger logger = Logger.getLogger(DeploymentVerticle.class.getName());

	@Override
	  public void start(Future<Void> startFuture) throws Exception {

	    DeploymentOptions options = new DeploymentOptions().setConfig(config());
	    
	    int procs = Runtime.getRuntime().availableProcessors();
	    
        vertx.deployVerticle(
            MainVerticle.class.getName(),
            options.setWorker(true).setInstances(procs * 2),
            event -> {
              if (event.succeeded()) {
                logger.info("IUDX Vert.x UI Server is started!");
                startFuture.complete();
              } else {
                logger.info("Unable to start UI Server Verticle " + event.cause());
                startFuture.fail(event.cause());
              }
            });

	}
}
