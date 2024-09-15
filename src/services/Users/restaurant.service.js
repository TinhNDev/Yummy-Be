const db = requrie("../../models/index.model.js")
const Restaurants= db.Restaurant;

class RestaurantService{
    static createRestaurant= async()=>{
        
    }
}

class Restaurant{
    constructor({name, image, address, status}){
       this.name = name;
       this.image = image;
       this.address = address;
       this.status = status;     
    }

    async createRestaurant(payload){
        payload = {...this};
        return await Restaurant.create({...payload}) 
    }
}

module.exports = RestaurantService;