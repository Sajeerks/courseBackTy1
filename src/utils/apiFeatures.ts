export  class ApiFeatures{
    queryStr:any
     query:any
    constructor(query:any , queryStr:any){
        this.queryStr  = queryStr
        this.query = query

       


    }

    search(){
        let keyword = this.queryStr?.keyword?{
            title:{
                $regex:this.queryStr.keyword,
             $options :"i"
            }
        }:{}
        console.log("keywordd==",{...keyword})
        this.query = this.query.find({...keyword})
        return this
}

filter(){
    const queryCopy = { ...this.queryStr };
    //   Removing some fields for category
    // console.log("queyCopy before", queryCopy)
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key ]);

    // Filter For Price and Rating
    // console.log("queyCopy after", queryCopy)


    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
        console.log("JSON.parse(queryStr)--",JSON.parse(queryStr));
    // console.log("queyCopy last", queryCopy)
    console.log("queryStr last", queryStr)



    return this;

}

pagination(resultPerPage:number) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }


}

