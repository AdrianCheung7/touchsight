import { useEffect, useState } from 'react'
import { parseRoute } from './contract/routes.ts'
import Explore from './student/Explore.tsx'
import About from './teacher/About.tsx'
import Edit from './teacher/Edit.tsx'
import Home from './teacher/Home.tsx'
import StudentPage from './teacher/StudentPage.tsx'
import Upload from './teacher/Upload.tsx'

export default function App() {
  const [route, setRoute] = useState(() => parseRoute(location.hash))

  useEffect(() => {
    const onHash = () => {
      setRoute(parseRoute(location.hash))
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  switch (route.page) {
    case 'explore':
      return (
        <Explore
          key={`${route.figureId}/${route.studentId}/${route.target ?? ''}`}
          figureId={route.figureId}
          studentId={route.studentId}
          target={route.target}
        />
      )
    case 'edit':
      return <Edit key={route.figureId} figureId={route.figureId} />
    case 'upload':
      return <Upload />
    case 'student':
      return <StudentPage key={route.studentId} studentId={route.studentId} />
    case 'about':
      return <About />
    default:
      return <Home />
  }
}
