import React from 'react';
import { Table, Glyphicon } from 'react-bootstrap';
import './contacts.css';
import { keys, values } from 'lodash';

const phoneTest = new RegExp(/^((\+1)|1)? ?\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})( ?(ext\.? ?|x)(\d*))?$/);
const formatPhone = val => {
    val = ('' + val).trim();
    var results = phoneTest.exec(val);
    if (results && results.length > 8) {
        return "(" + results[3] + ") " + results[4] + "-" + results[5] + (typeof results[8] !== "undefined" ? " x" + results[8] : "");
    } else {
        return val;
    }
}

// return a table row, including a checkbox and an edit icon
const Contact = props => {
    let item = props.item;
    return <tr>
        <td><Glyphicon
            glyph={props.isChkd ? 'check' : 'unchecked'}
            data-idx={props.idx}
            onClick={e => {
                e.preventDefault();
                let idx = +e.target.getAttribute('data-idx');
                idx > -1 && props.onContactSelect(idx);
            } }
            /></td>
        {item.map((item, idx) => {
            return <td key={idx} tabIndex={idx + 1}>{idx == 3 || idx == 5 ? formatPhone(item) : item}</td>
        })}
        <td><Glyphicon glyph="pencil" data-idx={props.idx} key={props.idx} /></td>
    </tr>
}

const ContactsTable = props => {
    let rows;
    if (!props.contacts.sets) {
        rows = <Contact text="No Contacts to Display" idx="-1" />;
    } else {
        let sets = props.contacts.sets || [];
        rows = props.contacts.contacts.map(function (item, idx) {
            return <Contact
                item={item}
                idx={idx.toString()}
                key={idx.toString()}
                onContactSelect={props.onContactSelect}
                isChkd={!! ~sets.indexOf(idx)}
                />;
        }, props);
    }

    let editing = props.contactQueue.editing;
    let queNames = keys(props.contactQueue.data);
    let queValues = values(props.contactQueue.data);
    return <Table striped>
        <thead>
            <tr className="highlight">
                <th></th>
                {props.labels.map((label, idx) => {
                    return <th key={idx}>{label}</th>
                })}
                <th></th>
            </tr>
            <tr>
                <td><Glyphicon
                    glyph={editing ? 'remove-circle' : 'chevron-right'}
                    onClick={editing ? props.onClearQueue : undefined}
                    /></td>
                {queValues.map((val, idx) => {
                    return <td key={idx}><span
                        data-name={queNames[idx]}
                        contentEditable
                        onInput={e => {
                            e.preventDefault();
                            props.onContactChange({ name: e.target.getAttribute('data-name'), value: e.target.textContent });
                        } }
                        >{val}</span></td>
                })}
                <td>{props.contactQueue.editing
                    ? <Glyphicon glyph="plus"
                        onClick={e => {
                            e.preventDefault();
                            props.onContactSave(values(props.contactQueue.data));
                        } }
                        />
                    : ''}</td>
            </tr>
        </thead>
        <tbody>{rows}</tbody>
    </Table>
}

export default ContactsTable;
