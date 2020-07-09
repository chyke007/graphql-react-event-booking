import React, { Component } from 'react'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context'
import './Events.css'
class EventsPage extends Component {
    state = {
        creating: false,
        events: []
    }

    static contextType = AuthContext;

    constructor(props){
        super(props)
        this.titleELRef = React.createRef();
        this.priceELRef = React.createRef();
        this.dateELRef = React.createRef();
        this.descriptionELRef = React.createRef();

    }

    componentDidMount(){
        this.fetchEvents()
    }

    startCreateEventHandler = () => {
        this.setState({ creating: true })
    } 

    modalCancelHadler = () => {
        this.setState({ creating: false })
    }

    
    modalConfirmHadler = () => {
        this.setState({ creating: false })
        const title = this.titleELRef.current.value;
        const price = +this.priceELRef.current.value;
        const date = this.dateELRef.current.value;
        const description = this.descriptionELRef.current.value;
    
        if(
           title.trim().length === 0 
        || price <= 0
        || date.trim().length === 0
        || description.trim().length === 0 ){
           return;   
        }
    
        const event = {title, price, date, description};
        console.log(event)

            const requestBody = {
            query: `
                mutation {
                    createEvent(eventInput: {title: "${title}", price: ${price}, date: "${date}", description: "${description}"}){
                        _id
                        title
                        date
                        description
                        price
                        creator {
                            _id
                            email
                        }

                    }
                }
            `
        }
        const token = this.context.token;

        fetch('http://localhost:8000/graphql',{
            method:'POST',
            body:JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201){
                    throw new Error('Falied')
            }
            return res.json()
        })
        .then(resData => {
            this.fetchEvents()
           
        })
        .catch(err => {
            console.log(err)
        })

    
    }

    fetchEvents() {

         const requestBody = {
            query: `
                query {
                    events{
                        _id
                        title
                        date
                        description
                        price
                        creator {
                            _id
                            email
                        }

                    }
                }
            `
        }

        fetch('http://localhost:8000/graphql',{
            method:'POST',
            body:JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201){
                    throw new Error('Falied')
            }
            return res.json()
        })
        .then(resData => {
            const events = resData.data.events;
            this.setState({ events: events})

           
        })
        .catch(err => {
            console.log(err)
        })

    
    }

    render(){
        const eventList = this.state.events.map( event => {
            return  <li key={event._id} className="events__list-item">{event.title}</li>
             
        } )
        return (
            <>
           {this.state.creating && <Backdrop/>}
            {this.state.creating && <Modal title="Add Events" canCancel canConfirm onCancel={this.modalCancelHadler} onConfirm={this.modalConfirmHadler}>
                <form>
                    <div className="form-control">
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" ref={this.titleELRef}/> 
                    </div>
                    <div className="form-control">
                        <label htmlFor="price">Price</label>
                        <input type="number" id="price" ref={this.priceELRef}/> 
                    </div>
                    <div className="form-control">
                        <label htmlFor="date">Date</label>
                        <input type="datetime-local" id="date" ref={this.dateELRef}/> 
                    </div>
                    <div className="form-control">
                        <label htmlFor="description">Description</label>
                        <textarea rows="4" id="description" ref={this.descriptionELRef}/> 
                    </div>
                </form>
            </Modal>}
            {this.context.token && <div className="events-control">
                <p>Share your own events!</p>
                <button className="btn" onClick={this.startCreateEventHandler}> Create Event</button>
            </div>}
            <ul className="events__list">
                 <li className="events__list-item">{eventList}</li>
            </ul>
            </>
        );
        
    }
}
export default EventsPage