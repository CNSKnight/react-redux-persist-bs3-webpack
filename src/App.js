import React from 'react';
// import './App.css';
import { combineReducers } from 'redux';
import { connect } from 'react-redux';
import ContactsTable from './contacts-table.comp';

import initData from './data.json';
import { isUndefined, keyBy, mapValues, isEqual } from 'lodash';

//const initData = YAML.parse(data);
// describe our store
const contsInit = {
  contacts: initData.contacts,
  sets: []
};

let keys = keyBy(initData.labels, (val) => {
  return val.toLowerCase();
});

const queueMap = mapValues(keys, () => { return ''; });
const queueInit = { data: { ...queueMap }, editing: false };

// reducers, state mappers
// cannot handl multiple keys, so all bundled in contacts.data
function contacts(state, action) {
  let conts, sets;
  switch (action.type) {
    case 'CONT_LISTALL':
      return (state.length && state) || contsInit;
    case 'CONT_SELECT':
      conts = [...state.contacts];
      sets = [...state.sets];
      let idx = sets.indexOf(action.index);
      if (idx !== -1) {
        sets.splice(idx, 1);
      } else {
        sets.push(action.index);
      }
      return { contacts: conts, sets: sets }
    case 'CONT_ADD':
      conts = [...state.contacts];
      sets = [...state.sets];
      conts.push(action.data);
      return { contacts: conts, sets: sets }
    case 'CONT_UPDATE':
      let data = action.data;
      conts = [...state.contacts];
      sets = [...state.sets];
      // no trim here

      isUndefined(data.name) || (conts[data.index].name = data.name);
      isUndefined(data.phone) || (conts[data.index].phone = data.phone);
      sets[data.index] = !!conts[data.index].name;
      return { contacts: conts, sets: sets }
    default:
      return state || contsInit; // must always return initial state
  }
}

function contactQueue(state, action) {
  switch (action.type) {
    case 'CONT_QUEUE':
      let queue = { ...state };
      queue.data[action.data.name] = action.data.value;
      queue.editing = !isEqual(queue.data, queueMap);
      return queue;
    case 'CONT_SAVE':
    case 'CONT_CLEAR':
      return queueInit;
    default:
      return state ? state : queueInit; // cannot return undefined
  }
}

const contactsApp = combineReducers({
  contacts,
  contactQueue
})

// return (
//   
// )

const mapStateToProps = (state) => {
  return {
    contacts: state.contacts, // contacts: sets:
    contactQueue: state.contactQueue
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onContactSelect: idx => {
      dispatch({
        type: 'CONT_SELECT',
        index: idx
      })
    },
    onContactChange: (data, index) => {
      if (isUndefined(index)) {
        dispatch({
          type: 'CONT_QUEUE',
          data: data
        });
      } else {
        dispatch({
          type: 'CONT_UPDATE',
          data: data,
          index: index
        });
      }
    },
    onContactSave: data => {
      dispatch({
        type: 'CONT_ADD',
        data: data
      });
    },
    onClearQueue: () => {
      dispatch({
        type: 'CONT_CLEAR'
      });
    }
  }
}

const onSelectHandlers = (store) => {
  store.subscribe(state => {
    // nothing to do here yet
    // let selected = store.getState().selected;
  });
}

const AppShell = props => {
  onSelectHandlers(props.store);

  return (
    <div className="App">
      <div className="contacts container">
        <div className="banner">
          <h4 className="highlight">External Contacts</h4>
          <p className="App-intro ">Select the client contacts associated with this offer</p>
        </div>
        <div className="panel panel-default">
          <ContactsTable labels={initData.labels} {...props} />
        </div>
      </div>
    </div>
  )
};

const App = connect(mapStateToProps, mapDispatchToProps)(AppShell);

export { contactsApp };
export default App;
