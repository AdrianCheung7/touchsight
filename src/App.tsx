import { useEffect, useState } from 'react'
import { parseRoute } from './contract/routes.ts'
import Explore from './student/Explore.tsx'
import About from './teacher/About.tsx'
import DemoPanel from './teacher/DemoPanel.tsx'
import Edit from './teacher/Edit.tsx'
import Header from './teacher/Header.tsx'
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

  // Teacher screens: move focus to the page's h1 on every route change, so the next Tab starts at the content.
  useEffect(() => {
    if (route.page !== 'explore') document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true })
  }, [route])

  if (route.page === 'explore') {
    return (
      <>
        <Explore
          key={`${route.figureId}/${route.studentId}/${route.target ?? ''}`}
          figureId={route.figureId}
          studentId={route.studentId}
          target={route.target}
        />
        <DemoPanel />
      </>
    )
  }

  return (
    <>
      <DemoPanel />
      <Header page={route.page} />
      {route.page === 'edit' ? (
        <Edit key={route.figureId} figureId={route.figureId} />
      ) : route.page === 'upload' ? (
        <Upload />
      ) : route.page === 'student' ? (
        <StudentPage key={route.studentId} studentId={route.studentId} />
      ) : route.page === 'about' ? (
        <About />
      ) : (
        <Home />
      )}
    </>
  )
}
