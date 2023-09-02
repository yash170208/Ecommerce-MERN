// import React, { Fragment } from "react";
// import { useSelector } from "react-redux";
// import { Route, Navigate } from "react-router-dom";

// const ProtectedRoute = ({ isAdmin, element:Component, ...rest }) => {
//   const { loading, isAuthenticated, user } = useSelector((state) => state.user);
// // const { loading, isAuthenticated } = useSelector((state) => state.user); 


//   return (
//     <Fragment>
//       {loading === false && (
//         <Route
//           {...rest}
//           render={(props) => {
//             if (isAuthenticated === false) {
//               return <Navigate to="/login" />;
//             }

//             if (isAdmin === true && user.role !== "admin") {
//               return <Navigate to="/login" />;
//             }

//             return <Component {...props} />;
//           }}
//         />
//       )}
//     </Fragment>
//   );
// };

// export default ProtectedRoute;


import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Route, Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAdmin, element: Component, ...rest }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  if (loading) {
    // Render a loading indicator or fallback UI while loading
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <Route
        {...rest}
        render={(props) => {
          if (isAuthenticated === false) {
            return <Navigate to="/login" />;
          }

          if (isAdmin === true && user.role !== "admin") {
            return <Navigate to="/login" />;
          }

          return <Component {...props} />;
        }}
      />
    </Fragment>
  );
};

export default ProtectedRoute;
