/**
 * @jest-environment jsdom
 */
 import '@testing-library/jest-dom'
import {fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"



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

// Test pour l'extension du fichier incorrect 
Object.defineProperty(window, 'localStorage', { value: localStorageMock })
window.localStorage.setItem('user', JSON.stringify({
  type: 'Employee'
}))

describe("Given I am connected as an employee", ()=>{
  describe("When I am on NewBill Page, and file extension is wrong",() =>{
    test("Then we can have an error message", ()=>{
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

 /*
 describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then mail icon in vertical layout should be highlighted", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon.classList.contains('active-icon')).toBe(true)
      
    })
  })
})
*/



// test pour simuler un formulaire valide et retour sur la page Bills 