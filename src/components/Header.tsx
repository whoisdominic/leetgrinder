import { GoGear } from "react-icons/go";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export function Header() {
  return (
    <div className="flex items-center justify-between w-full">
      <Link to="/">
        <h1 className="text-2xl font-bold cursor-pointer">LeetGrinder</h1>
      </Link>
      <Link to="/settings">
        <motion.div whileTap={{ rotate: 45 }} transition={{ duration: 0.3 }}>
          <GoGear className="text-2xl cursor-pointer" />
        </motion.div>
      </Link>
    </div>
  );
}

export default Header;
