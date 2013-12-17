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
            storagePageProperty = document.title;
        }
        else {
            throw Error('storage page property needs to be specified, because page don\'t have title');
        }
    }

    //reorder tabs on startup if data for page found
    if (getTabsOrderValue()) {
        var ul = $('#' + tabsContainerId + ' ul'), newOrderLis = [];

        $(getTabsOrderValue().split(',')).each(function (index, eachValue) {
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
            localStorage.setItem(storagePageProperty + 'Last', JSON.stringify({ number: ui.newTab.index(), id: ui.newTab.prop('id') }));
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

        //saving tab order
        localStorage.setItem(storagePageProperty + 'TabOrder', tabsArr);

        var lastObj = getLastObj();
        //update also selected tab number
        if (lastObj) {
            var liObj = $('#' + lastObj.id);
            var lis = $('#tabs ul li');

            var liIndex = lis.toArray().indexOf(liObj);

            localStorage.setItem(storagePageProperty + 'Last', JSON.stringify({ id: lastObj.id, number: liIndex }));
        }
    }

    /**
    Return saved number from if object found in local storage or 0 as default.
    */
    function getLastNumber() {
        var savedValue = getLastObj();

        if ((savedValue) && (savedValue.number)) {
            return savedValue.number;
        } else {
            return 0; //default number
        }
    }

    /**
    Return saved serialized object or null if not found in local storage.
    */
    function getLastObj() {
        var savedValue = localStorage.getItem(storagePageProperty + 'Last');

        if (savedValue) {
            return JSON.parse(savedValue);
        }
        else {
            return null;
        }
    }

    /**
    Return found object or null if not found in localstorage.
    */
    function getTabsOrderValue() {
        var savedValue = localStorage.getItem(storagePageProperty + 'TabOrder');

        if (savedValue) {
            return savedValue;
        }
        else {
            null;
        }
    }
}