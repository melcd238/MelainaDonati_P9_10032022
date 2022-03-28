/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import {ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';
import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon.classList.contains('active-icon')).toBe(true)
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    // Test for modal when button eye is clicked
    test("Then button eye is clicked, I should see modal with current bill", ()=>{
      document.body.innerHTML = BillsUI({ data: bills })
      const newBills = new Bills ({
        document,
      })
      $.fn.modal = jest.fn();
      const eyes = screen.getAllByTestId("icon-eye");
      const handleClickIconEye = jest.fn(newBills.handleClickIconEye);
      eyes.forEach((eye) => {
        eye.addEventListener("click", handleClickIconEye(eye));
      });
      userEvent.click(eyes[0]);
      expect(handleClickIconEye).toBeCalled();
      expect(screen.getByText('Justificatif')).toBeInTheDocument();// besoin d'importer import '@testing-library/jest-dom' pour utiliser toBeInTheDocument();
    })
    
  })
    // Test "nouvelle note de frais" is clicked I should be in new page
    describe('When I am on Bills Page and I click getNewBill btn', ()=>{
      test("Then it should render form to new bill ", ()=>{
        document.body.innerHTML = BillsUI({ data: bills })
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const newBills = new Bills ({
          document,
          onNavigate,
        })
       
        const buttonNewBill = screen.getByTestId('btn-new-bill')
        const handleClickNewBill = jest.fn(newBills.handleClickNewBill);
        buttonNewBill.addEventListener('click',handleClickNewBill)
        userEvent.click(buttonNewBill);
        expect(handleClickNewBill).toHaveBeenCalled();
        expect(screen.getByTestId("form-new-bill")).toBeInTheDocument()
       
      })
    })
    
})
