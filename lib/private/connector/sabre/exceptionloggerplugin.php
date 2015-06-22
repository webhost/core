<?php

/**
 * ownCloud
 *
 * @author Vincent Petry
 * @copyright 2014 Vincent Petry <pvince81@owncloud.com>
 *
 * @license AGPL3
 */
use Sabre\HTTP\Response;

class OC_Connector_Sabre_ExceptionLoggerPlugin extends \Sabre\DAV\ServerPlugin
{
	private $nonFatalExceptions = array(
		'Sabre\DAV\Exception\NotAuthenticated' => true,
		// the sync client uses this to find out whether files exist,
		// so it is not always an error, log it as debug
		'Sabre\DAV\Exception\NotFound' => true,
		// this one mostly happens when the same file is uploaded at
		// exactly the same time from two clients, only one client
		// wins, the second one gets "Precondition failed"
		'Sabre\DAV\Exception\PreconditionFailed' => true,
	);

	private $appName;
	private $logger;

	/**
	 * @param string $loggerAppName app name to use when logging
	 */
	public function __construct($loggerAppName = 'webdav', \OCP\ILogger $logger) {
		$this->appName = $loggerAppName;
		$this->logger = $logger;
	}

	/**
	 * This initializes the plugin.
	 *
	 * This function is called by \Sabre\DAV\Server, after
	 * addPlugin is called.
	 *
	 * This method should set up the required event subscriptions.
	 *
	 * @param \Sabre\DAV\Server $server
	 * @return void
	 */
	public function initialize(\Sabre\DAV\Server $server) {

		$server->subscribeEvent('exception', array($this, 'logException'), 10);
	}

	/**
	 * Log exception
	 *
	 * @internal param Exception $e exception
	 */
	public function logException(\Exception $e) {
		$exceptionClass = get_class($e);
		$level = \OCP\Util::FATAL;
		if (isset($this->nonFatalExceptions[$exceptionClass])) {
			$level = \OCP\Util::DEBUG;
		}

		$exception = [
			'Message' =>  $e->getMessage(),
			'Code' => $e->getCode(),
			'Trace' => $e->getTraceAsString(),
			'File' => $ex->getFile(),
			'Line' => $ex->getLine(),
		];
		$this->logger->log($level, 'Exception: ' . json_encode($exception), ['app' => $this->appName]);	}
}
