import { FC } from 'react'
import { motion } from 'framer-motion'
import underlineMotion from 'variants/underlineMotion'
import { Link } from 'react-router-dom'
import { DataLink } from 'components/Navigation/types'

interface SidebarNavProps {
	dataLinks: DataLink[]
}

const SidebarNav: FC<SidebarNavProps> = ({dataLinks}) => {
  return (
    <nav className="h-full">
      <ul className="flex flex-col text-4xl lg:text-5xl h-1/2 lg:h-3/5 justify-around">
        {dataLinks.map(({ path, name, external }) => (
          <motion.li initial="rest" whileHover="hover" animate="rest" className="max-w-fit">
            {external ? (
              <a href={path} target="_blank" rel="noreferrer">
                {name}
              </a>
            ) : (
              <Link to={path}>{name}</Link>
            )}
            <motion.div variants={underlineMotion} className="h-1 w-full bg-white" />
          </motion.li>
        ))}
      </ul>
    </nav>
  )
}

export default SidebarNav
