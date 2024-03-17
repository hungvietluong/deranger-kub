import React from "react";

export default function Clothes_Display(props){
    return(
        <div> 
            <img src = {props.url[0] == '/' ? `/backend` +  props.url : props.url}></img>
            <div className="item_details">
                <span className="item_name">{props.name}</span>
                <span className="item_season">{props.season}</span>
            </div>
            <p className="item_price">$ {props.price} </p>
        </div>
    )
}