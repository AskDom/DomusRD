// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom (el entorno de test) no trae TextEncoder/TextDecoder — react-router
// v7 los usa internamente y sin esto ni siquiera se puede importar.
import { TextEncoder, TextDecoder } from 'util';
if (typeof global.TextEncoder === 'undefined') global.TextEncoder = TextEncoder;
if (typeof global.TextDecoder === 'undefined') global.TextDecoder = TextDecoder;

// jsdom no implementa window.scrollTo — framer-motion lo llama desde un
// animation frame que a veces sigue corriendo después de que el test
// terminó, y sin este stub ensucia la consola con un error de "Not
// implemented" que no tiene nada que ver con el test en sí.
window.scrollTo = () => {};

// InboxContext/NotificationsContext abren un socket.io real apenas hay
// currentUser — sin mockearlo, cualquier test con sesión iniciada dispara
// una conexión de red real (a un backend que no existe en el entorno de
// test) y dejaría handles abiertos colgando después de cada test.
jest.mock('socket.io-client', () => ({
  io: () => ({ on: jest.fn(), off: jest.fn(), emit: jest.fn(), disconnect: jest.fn() }),
}));

// jsdom tampoco implementa IntersectionObserver (usado por el scroll-spy
// de las páginas legales, entre otros) — un stub sin comportamiento real
// alcanza para que los componentes que lo usan no revienten en los tests.
if (typeof global.IntersectionObserver === 'undefined') {
  global.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
