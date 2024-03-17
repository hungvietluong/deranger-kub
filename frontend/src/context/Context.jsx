import React from "react";
import { useContext, useEffect, useState } from "react";
const {Provider, Consumer} = React.createContext();
import axios from "axios";
import { CookiesProvider, useCookies } from "react-cookie";
import Cookies from 'universal-cookie';


function ContextProvider({children}){

    const [user, setUser] = React.useState();
    const [cart, setCart] = React.useState([])
    const [order, setOrder] = React.useState({})
    const [subTotal, setSubTotal] = React.useState()
    const[search, setSearch] = React.useState()
    const [token, setToken] = React.useState();
    // const [cookies, setCookie] = useCookies(["token"]);

    // const cookies = new Cookies();
    // const checkToken = cookies.get("checkToken");
   
    let expires = new Date()
    const oneDay = 1000 * 60 * 60 * 24
    expires.setTime(expires.getTime() + oneDay)
    const cookies = new Cookies(null, { path: '/', expires});


    const saveUser = (user, token) => {
        console.log("saving user ", user)
        console.log("new token in saveUser is", token)
        setUser(user);
        setToken(token)
       
        // setCookie('token', token, { path: '/',  expires, secure: true, sameSite: "none", httpOnly: false})

        cookies.set('token', token);


       

    }

    const removeUser = () => {
        setUser(null)
    }

    const fetchUser = async () => {
        console.log("fetching user")
        console.log("cookies", cookies.get("token"))
        try {
            const {data} = await axios.get(`/backend/api/v1/user/showCurrentUser`, {
                headers: {
                    "Content-Type": "application/json",
                  },
                withCredentials: true,
              
            })
            saveUser(data.user)
            console.log("the user is ", data.user)
        }
        catch(error){
            removeUser()
            console.log(error)
        }
    }

    const logoutUser = async() => {
        try {
            await axios.get(`/backend/api/v1/auth/logout`, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                  },
            })
            removeUser()
        }
        catch(error){
            console.log(error)
        }
    }

    React.useEffect(() => {
        fetchUser()
    }, [])

    // const [cart, setCart] = React.useState(() => JSON.parse(localStorage.getItem("cart")) || []);

    // function addItem(item){
    //     let isNew = true;
    //     let order_id = "";
    //     let newQty = 0;
    //     for(let i = 0; i<cart.length; i++){
    //         if((cart[i].id == item.id) && (cart[i].color == item.color) && (cart[i].size == item.size)){
    //             isNew = false;
    //             order_id = cart[i].order_id;
    //             newQty = cart[i].quantity;
    //             newQty++;
    //             console.log(cart[i].quantity, " ", newQty);
    //         }
    //     }
    //     if(isNew){
    //         setCart(prevCart => [...prevCart, item]);   
    //     } else{
    //         changeQty(order_id, newQty);
    //     }
    //     console.log(cart);
    // }

    const fetchCart = async() => {
        try{
            console.log("hiya")
            console.log("current cookie is", cookies)
            console.log("cookies", cookies.get("token"))

            const {data} = await axios.get(`/backend/api/v1/cart`,{
                headers: {
                    "Content-Type": "application/json",
                  },
                withCredentials: true,
              })
            console.log("set token is", token)
            setCart(data.cartItems)
            getSubTotal()

        }
        catch(error){
            console.log(error)
        }
    }

    const emptyCart = async() => {
        try {
            await axios.delete(`/backend/api/v1/cart`, {
                credentials: true,
                headers: {
                    "Content-Type": "application/json",
                  },

            })
            fetchCart()
        }
        catch(error){
            console.log(error)
        }
    }
  

    const getSubTotal = () => {
        let cost = 0;
        for(let i = 0; i<cart.length; i++){
            cost += (cart[i].price * cart[i].quantity);
        }
        setSubTotal(cost)
    }

    const addItem = async(item) => {
        try{
            console.log("adding item ", item);
            const {data} = await axios.post(`/backend/api/v1/cart`, item, {
                credentials: true,
                headers: {
                    "Content-Type": "application/json",
                  },

            });
            fetchCart();
            console.log(data.item);
        }
        catch(error){
            console.log(error)
        }
    }

    const removeItem = async(id) => {
        try {
            const {data} = await axios.delete(`/backend/api/v1/cart/${id}`, {
                credentials: true,
                headers: {
                    "Content-Type": "application/json",
                  },

            });
            console.log(data.msg)
            fetchCart();

        }
        catch(error){
            console.log(error)
        }
    }


    const changeQty = async (cartItemId, newQty) => {
        console.log("changing quantity")
        try{
            const quantity = {quantity: newQty}
            const {data} = await axios.patch(`/backend/api/v1/cart/${cartItemId}`, quantity, {
                credentials: true,
                headers: {
                    "Content-Type": "application/json",
                  },

            })
            console.log(data.cartItem)
            fetchCart();
        }
        catch(error) {
            console.log(error)
        }
    }


    const updateOrder = (newOrder) => {
        setOrder(newOrder);
        console.log("updating order ", order);
    }

    // React.useEffect(() => {
    //     localStorage.setItem("cart", JSON.stringify(cart))
    // }, [cart])


    React.useEffect(() => {
        fetchCart()
    }, [user])

    // React.useEffect(() => {
    //     showOrder()
    // }, [user])

    const updateSearch = (search) => {
        setSearch(search);
    }

    return(
        <Provider value = {{
            user: user,
            saveUser: saveUser,
            removeUser: removeUser,
            fetchUser: fetchUser,
            logoutUser: logoutUser,

            cart : cart,
            subTotal: subTotal,
            order: order,
            addItem : addItem,
            removeItem : removeItem,
            changeQty : changeQty,
            emptyCart: emptyCart,
            updateOrder: updateOrder,

            search: search,
            updateSearch: updateSearch

        }}
           
        >
            {children}
        </Provider>
    )
}

export const useGlobalContext = () => {
    return useContext({Provider, Consumer});
  };  

export {ContextProvider, Consumer as ContextConsumer}