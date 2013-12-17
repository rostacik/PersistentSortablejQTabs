/**
Sets up tabs to be sortable and saving their order all in localStorage.
@param tabsContainerIdParam ID of tabs container
@param storagePagePropertyParam Optional parameter - name of persisten object to save data to
*/
function persistentSortablejQTabs(tabsContainerIdParam, storagePagePropertyParam) {
    //some private props
    var tabsContainerId = tabsContainerIdParam;
    var storagePageProperty = storagePagePropertyParam;

    //required parameter
    if ((tabsContainerId === undefined) || (tabsContainerId === null)) {
        throw Error('tabs container id needs to be specified');
    }

    //optional parameter
    if ((storagePageProperty === undefined) || (storagePageProperty === null)) {
        if (document.title) {
            storagePageProperty = (document.title.replace(' ', '') + 'withid' + tabsContainerIdParam);
        }
        else {
            throw Error('storage page property needs to be specified, because page don\'t have title');
        }
    }

    //reorder tabs on startup if data for page found
    if (getTabsOrderValue()) {
        var ul = $('#' + tabsContainerId + ' ul'), newOrderLis = [];

        $(getTabsOrderValue()).each(function (index, eachValue) {
            var foundLi = $(ul).find('#' + eachValue);
            if (foundLi.length === 1) {
                foundLi.detach();
                newOrderLis.push(foundLi);
            }
        });

        ul.append(newOrderLis);
    }

    //setup tabs
    var tabs = $('#' + tabsContainerId).tabs({
        collapsible: true,
        hide: { effect: 'blind', duration: 200 },
        show: { effect: 'blind', duration: 200 },
        activate: function (e, ui) {
            saveLastObject({ id: ui.newTab.prop('id'), number: ui.newTab.index() });
        },
        active: getLastNumber()
    });

    //make them sortable
    var tabsItems = tabs.find('.ui-tabs-nav');
    tabsItems.sortable({
        axis: "x",
        stop: function () {
            tabs.tabs("refresh");
        },
        update: function () {
            tabsItemsUpdate(); //save the value on update
        }
    });

    /**
    Functionality when tabs are updated/moved - saving.
    */
    function tabsItemsUpdate() {
        var order = tabsItems.sortable("serialize"), tabsArr = [];

        $(order.split('&')).each(function (index, eachValue) {
            tabsArr.push(eachValue.replace('[]=', '_'));
        });

        saveTabsOrderValue(tabsArr);

        var lastObj = getLastObj();
        //update also selected tab number
        if (lastObj) {
            var liObj = document.getElementById(lastObj.id);
            var lis = $('#' + tabsContainerId + '#tabs ul li');

            var liIndex = lis.toArray().indexOf(liObj);

            saveLastObject({ id: lastObj.id, number: liIndex });
        }
    }

    //persistence sub part

    /**
    Return saved number from if object found in local storage or 0 as default.
    */
    function getLastNumber() {
        var savedLastValue = getLastObj();

        if ((savedLastValue) && (savedLastValue.number)) {
            return savedLastValue.number;
        } else {
            return 0; //default number
        }
    }

    /**
    Return saved serialized object or null if not found in local storage.
    */
    function getLastObj() {
        var savedValue = getStorageObject();

        if ((savedValue) && (savedValue.last)) {
            return savedValue.last;
        }
        else {
            null;
        }
    }

    /**
    Persis object with data about last opened/clicked tab.
    */
    function saveLastObject(lastObject) {
        var storedObj = getStorageObject();

        //vanilla state
        if (!storedObj) {
            storedObj = {}; //wrapper obj
        }
        storedObj.last = lastObject;

        saveStorageObject(storedObj);
    }

    /**
    Return found tab order object or null if not found in localstorage.
    */
    function getTabsOrderValue() {
        var savedValue = getStorageObject();

        if ((savedValue) && (savedValue.tabsOrder)) {
            return savedValue.tabsOrder;
        }
        else {
            null;
        }
    }

    /**
    Persis object with data about tabs order.
    */
    function saveTabsOrderValue(tabsOrder) {
        var storedObj = getStorageObject();

        //vanilla state
        if (!storedObj) {
            storedObj = {}; //new wrapper obj
        }
        storedObj.tabsOrder = tabsOrder; //update

        saveStorageObject(storedObj);
    }

    /**
    Returns parsed object if found, null if not.
    */
    function getStorageObject() {
        var savedObj = localStorage.getItem(storagePageProperty);

        if (savedObj) {
            return JSON.parse(savedObj);
        }
        else {
            return null;
        }
    }

    /**
    Saves passed object to local storage.
    */
    function saveStorageObject(obj) {
        if ((obj !== undefined) && (obj !== null)) {
            localStorage.setItem(storagePageProperty, JSON.stringify(obj)); //serialize and save
        }
        else {
            throw Error('object to save not specified');
        }
    }
}