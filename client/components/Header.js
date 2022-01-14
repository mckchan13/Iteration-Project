// import { AppBar, Toolbar, Typography } from "@material-ui/core";
// import React from "react";

// export default function Header() {
//   const displayDesktop = () => {
//     return (
//       <Toolbar>
//         <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
//           fit haús
//         </Typography>
//       </Toolbar>
//     );
//   };

//   return (
//     <header>
//       <AppBar position="static">{displayDesktop()}</AppBar>
//     </header>
//   );
// }

import React from "react";
import Search from "./Search";

const Header = () => {
  return (
    <div className="flex justify-between items-center px-11 py-4 bg-primary text-white">
      <h1 className="text-2xl font-bold">fithaus</h1>
      <Search />
      <ul class="flex ">
        <li className="pr-2 hover:text-blue100">
          <a href="#">Home</a>
        </li>
        <li className="pr-2 hover:text-blue100">
          <a href="#">About</a>
        </li>
        <li className="hover:text-blue100">
          <a href="#">Port</a>
        </li>
      </ul>
    </div>
  );
};

export default Header;
