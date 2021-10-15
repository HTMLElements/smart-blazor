if (!Element.prototype.matches) {
	Element.prototype.matches =
		Element.prototype.msMatchesSelector ||
		Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function (s) {
		var el = this;

		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1);
		return null;
	};
}

if (!window.Smart) {
	window.Smart = { RenderMode: 'manual' };
}
else {
	window.Smart.RenderMode = 'manual';
}


function stringify_object(object, depth = 0, max_depth = 3) {
	// change max_depth to see more levels, for a touch event, 2 is good
	if (depth > max_depth)
		return 'Object';

	const obj = {};
	for (let key in object) {
		let value = object[key];
		if (value instanceof Node)
			// specify which properties you want to see from the node
			value = { id: value.id };
		else if (value instanceof Window)
			value = 'Window';
		else if (value instanceof Date) {
			value = value.toJSON();
		}
		else if (value && Array.isArray(value) && value[0] !== undefined &&
			(typeof value[0] === 'string' || typeof value[0] === 'number' || value[0] instanceof Date || typeof value[0] === 'boolean')) {
			obj[key] = value;
			continue;
		}
		else if (value && Array.isArray(value) && value.length === 0) {
			obj[key] = value;
			continue;
		}
		else if (value && value && Array.isArray(value) && value[0] !== undefined &&
			(typeof value[0] === 'object') && key !== "path" && !(value[0] instanceof HTMLElement)) {
			for (let i = 0; i < value.length; i++) {
				value[i] = stringify_object(value[i], depth + 1, max_depth);
            }
        }
		else if (value instanceof Object)
			value = stringify_object(value, depth + 1, max_depth);
	
		obj[key] = value;
	}

	return depth ? obj : JSON.stringify(obj);
}

const instances = {};
const instanceProps = {};
const dotNetObjects = {};
const callbackProps = {};

window.smartBlazor = {
	ensureInstance: function (id, oldId) {
		const that = this;
		this.ensureLocalStorage(id);

		let isCreating = true;

		if (!instances[id]) {
			instances[id] = document.querySelector('#' + id);
		}

		if (!instances[id]) {
			delete instances[id];
			return;
        }

		instances[id].isCreating = isCreating;

		const hasRegisteredTag = window.Smart.Elements ? window.Smart.Elements.tagNames[instances[id].tagName.toLowerCase()] : false;

		if (!hasRegisteredTag) {
			return false;
		}

		let shouldInitAsHidden = true;

		switch (instances[id].nodeName) {
			case 'SMART-LIST-ITEM':
			case 'SMART-LIST-ITEMS-GROUP':
			case 'SMART-ACCORDION-ITEM':
			case 'SMART-TAB-ITEM':
			case 'SMART-MENU-ITEM':
			case 'SMART-MENU-ITEMS-GROUP':
			case 'SMART-FORM-GROUP':
			case 'SMART-FORM-CONTROL':
			case 'SMART-TREE-ITEM':
			case 'SMART-TREE-ITEMS-GROUP-ITEM':
			case 'SMART-LAYOUT-GROUP':
			case 'SMART-TAB-LAYOUT-GROUP':
			case 'SMART-LAYOUT-ITEM':
			case 'SMART-TAB-LAYOUT-ITEM': {
				shouldInitAsHidden = false;
			}
		}

		if (instances[id].parentNode && shouldInitAsHidden) {
			instances[id].hasVisibilityHidden = instances[id].classList.contains('smart-visibility-hidden');
			instances[id].animation = 'none';
		}

		instances[id].propertyChanged = function (propertyName, oldValue, newValue) {
			if (instances[id].isRendered || isCreating) {
				that.setStateProperty(id, propertyName, newValue);
			}
		}

		instances[id].onAttributeChanged = function (name) {
			if (!instances[id]) {
				return;
            }

			if (!instances[id].isRendered || isCreating) {
				return;
			}

			const property = instances[id].propertyByAttributeName[name];

			if (property) {
				const value = property.value;
				that.setStateProperty(id, property.name, value);
			}
		}

		const stateObj = that.getState(id);

		// remove old id.
		if (instanceProps[oldId]) {
			instanceProps[id] = Object.assign(instanceProps[id], instanceProps[oldId]);
			delete instanceProps[oldId];
		}

		if (instanceProps[id]) {
			for (let prop in instanceProps[id]) {
				const value = instanceProps[id][prop];

				that.setValue(id, prop, value);

				if (typeof value === 'object' || Array.isArray(value) || prop === 'className' || prop === 'style') {
					continue;
				}

				if (undefined === stateObj[prop]) {
					stateObj[prop] = value;
				}
			}

			if (that.keepState(id)) {
				window.localStorage.setItem(id, JSON.stringify(stateObj));
			}

			delete instanceProps[id];
		}


		if (stateObj) {
			for (let prop in stateObj) {
				instances[id][prop] = stateObj[prop];
			}
		}


		instances[id].initTimer = setInterval(() => {
			let parentNode = instances[id].parentNode;
			let hasParent = false;

			const clear = function () {
				if (instances[id]) {
					instances[id].animation = 'advanced';
					clearInterval(instances[id].initTimer);
				}
			}

			if (!parentNode) {
				clear();
				return;
			}

			while (parentNode) {
				if (parentNode.nodeName.toLowerCase().startsWith('smart-')) {
					if (parentNode.isRendered) {
						clear();
					}

					hasParent = true;
					break;
				}

				if (!hasParent) {
					clear();
					break;
				}

				parentNode = parentNode.parentNode;
			}
		}, 10);

		isCreating = false;
		instances[id].isCreating = false;
	},

	setStateProperty: function (id, propertyName, value) {
		const that = this;

		if (!that.keepState(id)) {
			return;
		}

		switch (propertyName) {
			case 'dataSource':
			case 'columns':
				return;
		}

		const stateObj = that.getState(id);

		if (typeof value === 'object' || Array.isArray(value)) {
			return;
		}

		stateObj[propertyName] = value;
		window.localStorage.setItem(id, JSON.stringify(stateObj));
	},

	getState(id) {
		
		if (window.localStorage.getItem(id)) {
			const state = window.localStorage.getItem(id);
			const stateObj = JSON.parse(state) || {};

			return stateObj;
		}
		
		return {};
	},

	keepState: function (id) {
		const blazorComponent = document.querySelector('#' + id);

		if (blazorComponent && blazorComponent.hasAttribute('blazor-state-mode')) {
			const attributeValue = blazorComponent.getAttribute('blazor-state-mode');

			if (attributeValue === 'none') {
				return false;
			}

			return true;
		}

		return false;
	},

	ensureLocalStorage: function (id) {
		if (!this.keepState(id)) {
			return;
		}

		if (window.localStorage.getItem(id)) {
			window.Smart.RenderMode = 'manual';
		}
		else {
			window.localStorage.setItem(id, '')
		}
	},

	initComponent: function (id, oldId, mappings, properties, dotNetObject) {
		const that = this;
		const componentProperties = properties.length === 0 ? {} : JSON.parse(properties);

		for (let propertyName in componentProperties) {
			that.setValue(id, propertyName, componentProperties[propertyName]);
        }
		const hasInstance = that.ensureInstance(id, oldId);

		if (!instances[id]) {
			delete instanceProps[id];

			that.render();
			return true;
		}

		if (mappings.length > 0) {
			instances[id].mappings = JSON.parse(mappings);
		}
		else {
			instances[id].mappings = [];
		}

		if (instances[id]) {
			if (instances[id].title !== 'You are using a Trial version of https://www.htmlelements.com/') {
				window.Smart.License = '';
			}
		}

		that.render();

		if (instances[id].whenRendered) {
			instances[id].whenRendered(() => {
				if (dotNetObject) {
					try {
						dotNetObject[that.dotNetInvoke]('OnComponentReady');
					}
					catch (err) {
						console.error(err);
					}
				}
			});
		}

		dotNetObjects[id] = dotNetObject;
		that.handleActionUpdates(instances[id], dotNetObject);

		if (hasInstance === false) {
			delete instanceProps[id];
			return false;
		}

		return true;
	},

	handleActionUpdates(instance, dotNetObject) {
		const that = this;

		const updateValue = (propertyName, propertyType, instance) => {
			let propertyValue = instance[propertyName];

			if (typeof propertyValue === 'object' &&
				window.Smart && window.Smart.Utilities && window.Smart.Utilities.DateTime &&
				propertyValue instanceof window.Smart.Utilities.DateTime) {
				propertyValue = propertyValue.toDate();
			}

			const result = stringify_object({ name: propertyName, type: propertyType, value: propertyValue });

			if (dotNetObjects[instance.id]) {
				dotNetObjects[instance.id][that.dotNetInvoke]('UpdateProperty', result);
			}
		}

		switch (instance.nodeName.toLowerCase()) {
			case 'smart-table':
				{
					instance.addEventListener('change', (event) => {
						updateValue('selected', 'array', instance);
					});
					break;
				}
			case 'smart-tabs':
				{
					instance.addEventListener('change', (event) => {
						updateValue('selectedIndex', 'int', instance);
					});
					break;
				}
			case 'smart-progress-bar':
			case 'smart-circular-progress-bar':
			case 'smart-gauge':
			case 'smart-tank':
			case 'smart-rating':
			case 'smart-scroll-bar':
			case 'smart-slider': {
				instance.addEventListener('change', (event) => {
					updateValue('value', 'double', instance);
				});
				break;
			}
			case 'smart-radio-button':
				{
					instance.addEventListener('change', (event) => {
						const radioButtons = document.querySelectorAll('smart-radio-button');
						
						for (let i = 0; i < radioButtons.length; i++) {
							const item = radioButtons[i];

							if (instances[item.id]) {
								updateValue('checked', 'boolean', instances[item.id]);
							}
                        }
					});
					break;
                }
			case 'smart-toggle-button':
			case 'smart-check-box':
			case 'smart-switch-button': {
				instance.addEventListener('change', (event) => {
					if (event.detail && event.detail.changeType !== 'api') {
						updateValue('checked', 'boolean', instance);
					}
				});
				break;
			}
			case 'smart-button-group':
				{
					instance.addEventListener('change', (event) => {
						updateValue('selectedIndexes', 'array', instance);
						updateValue('selectedValues', 'array', instance);
					});
					break;
                }
			case 'smart-drop-down-list':
			case 'smart-combo-box':
				{
					instance.addEventListener('open', (event) => {
						updateValue('opened', 'boolean', instance);
					});
					instance.addEventListener('close', (event) => {
						updateValue('opened', 'boolean', instance);
					});
					instance.addEventListener('change', (event) => {
						updateValue('selectedIndexes', 'array', instance);
						updateValue('selectedValues', 'array', instance);
					});
					break;
				}
			case 'smart-list-box': {
				const updateSelectedProperty = () => {
					const listItems = instance.querySelectorAll('smart-list-item');
					const listItemsGroups = instance.querySelectorAll('smart-list-items-group');

					for (let i = 0; i < listItems.length; i++) {
						const item = listItems[i];

						if (instances[item.id]) {
							updateValue('selected', 'boolean', instances[item.id]);
						}
					}

					for (let i = 0; i < listItemsGroups.length; i++) {
						const item = listItemsGroups[i];

						if (instances[item.id]) {
							updateValue('selected', 'boolean', instances[item.id]);
						}
					}
				}


				instance.addEventListener('change', (event) => {
					updateValue('selectedIndexes', 'array', instance);
					updateValue('selectedValues', 'array', instance);
					updateSelectedProperty();
				});

				break;
			}
			case 'smart-accordion': {
				const updateExpandedProperty = () => {
					const items = instance.querySelectorAll('smart-accordion-item');

					for (let i = 0; i < items.length; i++) {
						const item = items[i];

						if (instances[item.id]) {
							updateValue('expanded', 'boolean', instances[item.id]);
						}
					}
				}

				instance.addEventListener('expand', (event) => {
					updateExpandedProperty();
				});

				instance.addEventListener('collapse', (event) => {
					updateExpandedProperty();
				});
				break;
			}
			case 'smart-menu': {
				const updateExpandedProperty = () => {
					const items = instance.querySelectorAll('smart-menu-items-group');

					for (let i = 0; i < items.length; i++) {
						const item = items[i];

						if (instances[item.id]) {
							updateValue('expanded', 'boolean', instances[item.id]);
						}
					}
				}

				const updateSelectedProperty = () => {
					const items = instance.querySelectorAll('smart-menu-item');
					const itemGroups = instance.querySelectorAll('smart-menu-items-group');

					for (let i = 0; i < items.length; i++) {
						const item = items[i];

						if (instances[item.id]) {
							updateValue('selected', 'boolean', instances[item.id]);
						}
					}

					for (let i = 0; i < itemGroups.length; i++) {
						const item = itemGroups[i];

						if (instances[item.id]) {
							updateValue('selected', 'boolean', instances[item.id]);
						}
					}
				}


				instance.addEventListener('itemClick', (event) => {
					updateSelectedProperty();
				});

				instance.addEventListener('expand', (event) => {
					updateExpandedProperty();
				});

				instance.addEventListener('collapse', (event) => {
					updateExpandedProperty();
				});
				break;
			}
			case 'smart-tree': {
				const updateExpandedProperty = () => {
					const treeItems = instance.querySelectorAll('smart-tree-items-group');

					for (let i = 0; i < treeItems.length; i++) {
						const item = treeItems[i];

						if (instances[item.id]) {
							updateValue('expanded', 'boolean', instances[item.id]);
						}
					}
				}

				const updateSelectedProperty = () => {
					const treeItems = instance.querySelectorAll('smart-tree-item');
					const treeItemsGroups = instance.querySelectorAll('smart-tree-items-group');

					for (let i = 0; i < treeItems.length; i++) {
						const item = treeItems[i];

						if (instances[item.id]) {
							updateValue('selected', 'boolean', instances[item.id]);
						}
					}

					for (let i = 0; i < treeItemsGroups.length; i++) {
						const item = treeItemsGroups[i];

						if (instances[item.id]) {
							updateValue('selected', 'boolean', instances[item.id]);
						}
					}
				}


				instance.addEventListener('change', (event) => {
					updateValue('selectedIndexes', 'array', instance);
					updateSelectedProperty();
				});

				instance.addEventListener('expand', (event) => {
					updateExpandedProperty();
				});

				instance.addEventListener('collapse', (event) => {
					updateExpandedProperty();
				});
				break;
			}
			case 'smart-calendar': {
				instance.addEventListener('change', (event) => {
					updateValue('selectedDates', 'array', instance);
				});
				break;
			}
			case 'smart-date-range-input':
			case 'smart-date-time-picker':
			case 'smart-date-input': {
				instance.addEventListener('change', (event) => {
					updateValue('value', 'date', instance);
				});
				instance.addEventListener('open', (event) => {
					updateValue('opened', 'boolean', instance);
				});
				instance.addEventListener('close', (event) => {
					updateValue('opened', 'boolean', instance);
				});
				break;
			}
			case 'smart-pager': {
				instance.addEventListener('change', (event) => {
					updateValue('pageIndex', 'int', instance);
				});
				break;
        	}
			case 'smart-window': {
				instance.addEventListener('open', (event) => {
					updateValue('opened', 'boolean', instance);
				});
				instance.addEventListener('close', (event) => {
					updateValue('opened', 'boolean', instance);
				});
				break;
			}
			case 'smart-drop-down-button':
				{
					instance.addEventListener('open', (event) => {
						updateValue('opened', 'boolean', instance);
					});
					instance.addEventListener('close', (event) => {
						updateValue('opened', 'boolean', instance);
					});

					break;
				}
			case 'smart-editor': {
				instance.addEventListener('change', (event) => {
					updateValue('value', 'string', instance);
				});
				break;
            }
			case 'smart-input':
			case 'smart-color-picker':
			case 'smart-check-input':
			case 'smart-color-input':
			case 'smart-time-input':
			case 'smart-multi-input':
			case 'smart-multi-combo-input':
			case 'smart-number-input':
			case 'smart-numeric-text-box':
			case 'smart-masked-text-box':
			case 'smart-multiline-text-box':
			case 'smart-text-area':
			case 'smart-password-input':
			case 'smart-password-text-box':
			case 'smart-text-box': {
				instance.addEventListener('changing', (event) => {
					updateValue('value', 'string', instance);
				});
				instance.addEventListener('change', (event) => {
					updateValue('value', 'string', instance);
				});
				instance.addEventListener('open', (event) => {
					updateValue('opened', 'boolean', instance);
				});
				instance.addEventListener('close', (event) => {
					updateValue('opened', 'boolean', instance);
				});
				break;
			}
		}
    },

	render: function () {
		const getInstancesCount = () => {
			let instancesCount = 0;

			for (let id in instances) {
				const instance = instances[id];

				if (instance) {
					instancesCount++;

					if (instance.isCreating === false) {
						instancesCount--;
					}
				}
			}

			return instancesCount;
		}

		const canRender = () => {
			const elements = document.querySelectorAll('[smart-blazor]');
			
			for (let element in elements) {
				const instance = elements[element]

				if (!instance.nodeName) {
					continue;
				}

				if (!instances[instance.id]) {
					return false;
                }
			}

			return true;
        }

		if (getInstancesCount() === 0 && Object.keys(instanceProps).length === 0) {
			if (window.Smart.RenderMode === 'manual') {
				if (document.readyState === 'complete') {
					if (window.Smart.RenderMode === 'manual') {
						if (!canRender()) {
							return;
						}

						window.Smart.Render();
					}
				}
				else {
					document.addEventListener('readystatechange', function () {
						if (document.readyState === 'complete') {
							if (!canRender()) {
								return;
							}

							if (getInstancesCount() === 0 && Object.keys(instanceProps).length === 0) {
								window.Smart.Render();
							}
							else {
								requestAnimationFrame(() => {
									window.Smart.Render();
								});	
							}
						}
					});
				}
			}
		}
	},

	beforeRender() {
		window.Smart.RenderMode = 'manual';
	},

	removeComponent: function (id) {
		if (instances[id]) {
		//	window.Smart.RenderMode = 'manual';

			if (instances[id].initTimer) {
				clearInterval(instances[id].initTimer);
			}

			delete instances[id];
		}
	},

	addCallbackHandler: function (id, callbackName, callback, dotNetObject) {
		const that = this;
		if (!instances[id]) {
			return;
		}

		instances[id][callbackName] = async (args) => {
			try {
				if (undefined === args) {
					args = {};
				}

				if (typeof args === 'number' || typeof args === 'boolean' || typeof args === 'string' || args instanceof Date === true) {
					var value = await dotNetObject[that.dotNetInvoke](callback, '' + args);

					return value;
				}
				else {
					if (args.details !== undefined) {
						args.id = args.details.id;
						delete args.details;
					}
					if (args.command !== undefined) {
						delete args.command;
                    }
					if (args.event !== undefined) {
						delete args.event;
					}
					if (args.handled !== undefined) {
						delete args.handled;
					}

					var value = dotNetObject[that.dotNetInvoke](callback, stringify_object(args));

					return value;
				}
			}
			catch (err) {
				console.error(err);
			}
		}
	},

	removeCallbackHandler: function (id, callbackName, callback, dotNetObject) {
		if (!instances[id]) {
			return;
		}

		instances[id][callbackName] = null;
	},

	addEventHandler: function (id, eventName, callback, dotNetObject) {
		const that = this;

		if (!instances[id]) {
			return;
		}

		instances[id].addEventListener(eventName, function (event) {
			try {
				delete event.context;

				setTimeout(() => {
					dotNetObject[that.dotNetInvoke](callback, stringify_object(event));
				});
			}
			catch (err) {
				console.error(err);
            }
		});
	},

	removeEventHandler: function (id, eventName, callback) {
		instances[id].removeEventListener(eventName, callback);
	},

	get dotNetInvoke() {
		if (this._isWebAssembly === undefined && document.readyState === 'complete') {
			const scripts = document.querySelectorAll('script');

			this._isWebAssembly = false;

			for (let i = 0; i < scripts.length; i++) {
				if (scripts[i].src.indexOf('blazor.webassembly.js') >= 0) {
					this._isWebAssembly = true;
				}
			}
		}

		if (this._isWebAssembly) {
			return 'invokeMethod';
		}

		return 'invokeMethodAsync';
	},

	setValue: function (id, propertyName, value) {
		const that = this;

		if (typeof value === 'object' || Array.isArray(value)) {
			const getConvertedValue = (value) => {
				let object = {};

				if (Array.isArray(value)) {
					object = [];

					for (let i = 0; i < value.length; i++) {
						object.push(getConvertedValue(value[i]));
					}
				}
				else if (typeof value === 'object') {
					if (value.properties) {
						for (let propertyName in value.properties) {
							object[propertyName] = value.properties[propertyName];

							if (!object[propertyName]) {
								continue;
							}

							if (object[propertyName].properties) {
								object[propertyName] = getConvertedValue(object[propertyName].properties);
							}
							else if (Array.isArray(object[propertyName])) {
								object[propertyName] = getConvertedValue(object[propertyName]);
							}
						}
					}
					else {
						const propertyNames = Object.keys(value);

						for (let index in propertyNames) {
							const propertyName = propertyNames[index];

							if (!value[propertyName]) {
								object[propertyName] = value[propertyName];
								continue;
							}

							if (value[propertyName].properties) {
								object[propertyName] = getConvertedValue(value[propertyName].properties);
							}
							else if (Array.isArray(value[propertyName])) {
								object[propertyName] = getConvertedValue(value[propertyName]);
							}
							else if (value[propertyName] && value[propertyName].toString().endsWith('Handler')) {
								const callback = value[propertyName];
								const callbackHandler = callback.split('|');

								object[propertyName] = async (...args) => {
									try {
										if (undefined === args || (args && args.length === 0)) {
											args = {};
										}

										for (let arg in args) {
											if (args[arg] && args[arg] instanceof HTMLElement) {
												if (args[arg].getValue) {
													args[arg].getValue();
												}
												else if (args[arg].value) {
													args[arg] = args[arg].value;
                                                }
												else {
													args[arg] = args[arg].nodeName;
												}
											}
											else if (args[arg] && args[arg] instanceof Date) {
												args[arg] = args[arg].toString();
											}
											else if (args[arg] && args[arg].$) {
												args[arg] = JSON.parse(JSON.stringify(args[arg]));
												delete args[arg].$;
											}
										}

										const customArgs = stringify_object(args);
										const newArgs = {
											id: callbackHandler[0],
											name: callbackHandler[1],
											detail: customArgs
                                        }

										const dotNetObject = dotNetObjects[id];
										if (dotNetObject) {
											if (typeof args === 'number' || typeof args === 'boolean' || typeof args === 'string' || args instanceof Date === true) {
												var value = await dotNetObject[that.dotNetInvoke]('OnCustomCallback', '' + newArgs);

												return value;
											}
											else {
												var value = await dotNetObject[that.dotNetInvoke]('OnCustomCallback', stringify_object(newArgs));

												return value;
											}
										}
									}
									catch (err) {
										console.error(err);
									}
                                }
                            }
							else {
								object[propertyName] = value[propertyName];
							}
						}
					}
				}
				else {
					object = value;
				}

				return object;
			}

			value = getConvertedValue(value);
		}


		if (instances[id]) {
			if (instances[id].mappings && instances[id].mappings[propertyName + '.' + value]) {
				instances[id][propertyName] = instances[id].mappings[propertyName + '.' + value];
				return;
			}

			if (propertyName && propertyName.toString().indexOf('.') >= 0) {
				const subProperties = propertyName.split('.');
				let instance = instances[id];

				for (let i = 0; i < subProperties.length - 1; i++) {
					instance = instance[subProperties[i]];
				}

				propertyName = subProperties[subProperties.length - 1];
				instance[propertyName] = value;
				return;
			}

			if (propertyName === 'className') {
				if (!instances[id].isRendered && !instances[id].isCreating) {
					if (!instanceProps[id]) {
						instanceProps[id] = {};
					}

					instanceProps[id][propertyName] = value;
					return;
				}

				instances[id][propertyName] = value;
				instances[id].classList.add('smart-element');
				instances[id].classList.add(instances[id].nodeName.toLowerCase());
				return;
			}

			instances[id][propertyName] = value;
		}
		else {
			if (Smart.RenderMode === 'manual') {
				if (!instanceProps[id]) {
					instanceProps[id] = {};
				}

				instanceProps[id][propertyName] = value;
			}
		}
	},

	setPropertyValue: function (id, propertyName, value) {
		value = JSON.parse(value);

		this.setValue(id, propertyName, value);
	},

	getPropertyValue: function (id, propertyName, callback, dotNetObject) {
		const that = this;

		if (!instances[id]) {
			return;
		}

		const propertyValue = instances[id][propertyName];

		if (typeof propertyValue === 'object' && propertyValue instanceof window.Smart.DataAdapter) {
			const dataSource = [...propertyValue.dataSource];
			for (let i = 0; i < dataSource.length; i++) {
				const dataItem = dataSource[i];
				const keys = Object.keys(dataItem);

				for (let j = 0; j < keys.length; j++) {
					const dataKey = keys[j];
					let value = dataItem[dataKey];

					if (/<.+?>/.test(value)) {
						// sanitizing value when it contains HTML tags
						if (value.replace) {
							value = value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').
								replace(/'/g, '&#39;').replace(/"/g, '&quot;');
							dataItem[dataKey] = value;
						}
					}
                }
			}
			const result = JSON.stringify({ name: propertyName, value: dataSource, type: '[]' });

			return dotNetObject[that.dotNetInvoke](callback, result);
		}

		const propertyType = instances[id]._properties[propertyName] ? instances[id]._properties[propertyName].type : 'any';

		const result = stringify_object({ name: propertyName, value: propertyValue, type: propertyType });

		return dotNetObject[that.dotNetInvoke](callback, result);
	},

	addClass: function (id, className) {
		instances[id].classList.add(className);
	},

	removeClass: function (id, className) {
		instances[id].classList.remove(className);
	},

	invokeMethod: function (id, name, args) {
		if (id) {
			try {
				const tempArgs = JSON.parse(args);
				args = tempArgs;
			}
			catch (error) {
			}
			
			if (instances[id]) {
				if (instances[id].isRendered) {
					if (!instances[id][name]) {
						console.log('Invoke cannot be executed for method: ' + name);
					}

					const result = instances[id][name](...args);

					if (result === undefined) {
						return;
					}

					if (result === null) {
						return null;
					}

					if (Array.isArray(result)) {
						return result;
					}

					if (result instanceof HTMLElement) {
						return null;
					}

					if (typeof result === 'string') {
						return result;
					}
					
					return stringify_object(result);
				}
				else {
					instances[id].whenRendered(() => {
						if (!instances[id][name]) {
							console.log('Invoke cannot be executed for method: ' + name);
						}

						instances[id][name](...args);
					});
				}
			}
			else {
				return undefined;
			}
		}
	}
};