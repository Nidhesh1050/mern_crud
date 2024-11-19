
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import User from './User'
import CreateUser from './CreateUser'
import UpdateUser from './UpdateUser'
import ThreeDViewer from './ThreeDViewer'
import Login from './Login'

function App() {


  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/user' element={<User/>}></Route>
        <Route path='/' element={<CreateUser/>}></Route>
        <Route path='/update/:id' element={<UpdateUser/>}></Route>
        <Route path='/threeDViewer' element={<ThreeDViewer/>}></Route>
        <Route path='/login' element={<Login/>}></Route>

      
       
      </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
