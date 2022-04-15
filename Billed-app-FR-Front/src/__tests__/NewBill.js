/**
 * @jest-environment jsdom
 */
 import '@testing-library/jest-dom'
import {fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import router from "../app/Router"



describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then NewBill Page should be render", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();
    })
  })
})

 
 
 describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then mail icon in vertical layout should be highlighted",async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon.classList.contains('active-icon')).toBe(true)
      
    })
  })
})





// extension fichier incorrect
describe("Given I am connected as an employee", ()=>{
  describe("When I am on NewBill Page, and file extension is wrong",() =>{
    test("Then we can have an error message", ()=>{

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
       window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
      }))

        document.body.innerHTML = NewBillUI()
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const newBill = new NewBill({
          document,
          onNavigate,
          store: null,
          localStorage: window.localStorage 
        })
        const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
        const inputFile = screen.getByTestId("file")
        inputFile.addEventListener("change", handleChangeFile)
        fireEvent.change(inputFile, {
          target: {
            files: [new File(["test.gif"], "test.gif", { type: "image/gif" })],
          }
      })
      const errorMessage = screen.getByTestId('error')
      expect(errorMessage).toBeTruthy();
        
    })

  })
})

// test pour simuler un formulaire valide et retour sur la page Bills 
describe("Given I am connected as an employee", ()=>{
  describe("when I am on NewBill Page , and I submit  a valid form", ()=>{
    test("Then New bill should be created", async ()=>{
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
     type: 'Employee'
     }))
     document.body.innerHTML = NewBillUI()
     const onNavigate = (pathname) => {
       document.body.innerHTML = ROUTES({ pathname })
     }
     const newBill = new NewBill({
       document,
       onNavigate,
       store: null,
       localStorage: window.localStorage 
     })
     // creation d'une new Bill
     const form = screen.getByTestId('form-new-bill')
     const test = {
      name: "transport test",
      date: "2022-04-11",
      type: "voyage test",
      amount: 350,
      pct: 70,
      vat: 20,
      commentary: "commentaire de test",
      fileName: "facture test",
      fileUrl: "billTest.jpg"
    }
    const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
    newBill.createBill = (newBill) => newBill
    document.querySelector(`input[data-testid="expense-name"]`).value = test.name
    document.querySelector(`input[data-testid="datepicker"]`).value = test.date
    document.querySelector(`select[data-testid="expense-type"]`).value = test.type
    document.querySelector(`input[data-testid="amount"]`).value = test.amount
    document.querySelector(`input[data-testid="vat"]`).value = test.vat
    document.querySelector(`input[data-testid="pct"]`).value = test.pct
    document.querySelector(`textarea[data-testid="commentary"]`).value = test.commentary
    newBill.fileUrl = test.fileUrl
    newBill.fileName = test.fileName 
    
    form.addEventListener('click', handleSubmit)
    fireEvent.click(form)
    expect(handleSubmit).toHaveBeenCalled()
    expect(screen.getByTestId("btn-new-bill")).toBeInTheDocument()
    })
  })
})

// Tests pour l'extension du fichier 

// extension fichier correct
/*
describe("Given I am connected as an employee", ()=>{
  describe("When I am on NewBill Page, and file extension is ok",() =>{
    test("Then we can NOT have an error message", ()=>{

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
     type: 'Employee'
     }))

        document.body.innerHTML = NewBillUI()
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const newBill = new NewBill({
          document,
          onNavigate,
          store: null,
          localStorage: window.localStorage 
        })
        const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
        const inputF = screen.getByTestId("file")
        inputF.addEventListener("change", handleChangeFile)
        fireEvent.change(inputF, {
          target: {
              files: [new File(["test.jpg"], "test.jpg", { type: "image/jpg" })],
          }
      })
      //  expect(screen.queryByTestId('error')).not.toBeInTheDocument();
    })

  })
})
*/


