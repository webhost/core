/*
 * Copyright (c) 2015
 *
 * This file is licensed under the Affero General Public License version 3
 * or later.
 *
 * See the COPYING-README file.
 *
 */

(function(OC) {

	var FileInfo = function(data) {
		var path = data.path;
		this.id = parseInt(data.id, 10);
		this.path = OC.dirname(path);
		this.name = OC.basename(path);
		this.mtime = data.mtime;
		this.etag = data.etag;
		this.permissions = data.permissions;
		this.size = data.size;
		this.mimetype = data.mimetype;
		this._props = data._props;

		// TODO: isSharedMount and other props

		if (this.mimetype === 'httpd/unix-directory') {
			this.type = 'dir';
		} else {
			this.type = 'file';
			this.isPreviewAvailable = true;
		}
	};

	FileInfo.prototype = {
		/**
		 * File id
		 *
		 * @type int
		 */
		id: null,

		/**
		 * File name
		 *
		 * @type String
		 */
		name: null,

		/**
		 * Path leading to the file, without the file name.
		 *
		 * @type String
		 */
		path: null,

		/**
		 * Mime type
		 *
		 * @type String
		 */
		mimetype: null,

		/**
		 * File type. 'file'  for files, 'dir' for directories.
		 *
		 * @type String
		 * @deprecated rely on mimetype instead
		 */
		type: 'file',

		/**
		 * Permissions.
		 *
		 * @see OC#PERMISSION_ALL for permissions
		 * @type int
		 */
		permissions: null,

		/**
		 * Modification time
		 *
		 * @type int
		 */
		mtime: null,

		/**
		 * Etag
		 *
		 * @type String
		 */
		etag: null,

		/**
		 * Whether the file is a share mount point
		 *
		 * @type boolean
		 */
		isShareMountPoint: false,

		/**
		 * Whether previews are supported for this file's mime type
		 *
		 * @type boolean
		 * @deprecated infer from mime type
		 */
		isPreviewAvailable: false,

		/**
		 * URL path to the mime type icon
		 *
		 * @deprecated infer from the mime type
		 */
		icon: null
	};

	if (!OC.Files) {
		/**
		 * @namespace OC.Files
		 */
		OC.Files = {};
	}
	OC.Files.FileInfo = FileInfo;
})(OC);

