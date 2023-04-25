var storage={
    set(key,value){

        localStorage.setItem(key,JSON.stringify(value));
    },
    get(key){
       
        let s= JSON.parse(localStorage.getItem(key));
        if(s==undefined || s==null)
        {
            s=[];
        }
         
        return s;

    },remove(key){
        localStorage.removeItem(key)
    }
};

export default storage;
