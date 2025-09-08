

const getStockStatus = (quantity: number) => {
    if(quantity===0){
        return "Out of Stock"
    }
    else if(quantity <= 5){
        return "Limited Stock"
    }
    else{
        return "In Stock"
    }
}

export default getStockStatus;