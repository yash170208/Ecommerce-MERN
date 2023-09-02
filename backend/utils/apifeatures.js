// class ApiFeatures {
//   constructor(query, queryStr) {
//     this.query = query;
//     this.queryStr = queryStr;
//   }

//   search() {
//     const keyword = this.queryStr.keyword
//       ? {
//           name: {
//             $regex: this.queryStr.keyword,
//             $options: "i",
//           },
//         }
//       : {};

//     this.query = this.query.find({ ...keyword });
//     return this;
//   }

//   filter() {
//     const queryCopy = { ...this.queryStr };
//     //   Removing some fields for category
//     const removeFields = ["keyword", "page", "limit"];

//     removeFields.forEach((key) => delete queryCopy[key]);

//     // Filter For Price and Rating

//     let queryStr = JSON.stringify(queryCopy);
//     queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);    

//     this.query = this.query.find(JSON.parse(queryStr));

//     return this;
//   }

//   pagination(resultPerPage) {
//     const currentPage = Number(this.queryStr.page) || 1;

//     const skip = resultPerPage * (currentPage - 1);

//     this.query = this.query.limit(resultPerPage).skip(skip);

//     return this;
//   }
// }

// module.exports = ApiFeatures;


// In the ApiFeatures class

class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    // Your search logic here to modify this.query based on this.queryString
    const keyword = this.queryString.keyword
          ? {
              name: {
                $regex: this.queryString.keyword,
                $options: "i",
              },
            }
          : {};
    
        this.query = this.query.find({...keyword});
    return this;
  }



  filter() {
    // Your filter logic here to modify this.query based on this.queryString

    const queryCopy = { ...this.queryString};
        //   Removing some fields for category
        const removeFields = ["keyword", "page", "limit"];
    
        removeFields.forEach((key) => delete queryCopy[key]);
    
        // Filter For Price and Rating
    
        let queryString = JSON.stringify(queryCopy);
        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    
        this.query = this.query.find(JSON.parse(queryString));
  
    return this;
  }



  pagination(resultPerPage) {
    // Execute the query here and return the results
    const page = parseInt(this.queryString.page, 10) || 1;
    const skip = (page - 1) * resultPerPage;
    this.query = this.query.limit(resultPerPage).skip(skip);

    return this.query.exec(); // Execute the modified query and return the result
  }
}

module.exports = ApiFeatures;
