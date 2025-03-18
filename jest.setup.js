import '@testing-library/jest-dom';

// Mock Three.js
jest.mock('three', () => {
  const mockAdd = jest.fn();
  const mockSetFromObject = jest.fn(() => ({ intersectsBox: jest.fn(() => true) }));
  const mockClone = jest.fn(() => ({ x: 0, y: 0, z: 0 }));

  return {
    Scene: jest.fn(() => ({
      add: mockAdd
    })),
    PerspectiveCamera: jest.fn(() => ({
      position: { z: 0 }
    })),
    WebGLRenderer: jest.fn(),
    BoxGeometry: jest.fn(),
    MeshStandardMaterial: jest.fn(),
    Mesh: jest.fn(() => ({
      position: { x: 0, y: 0, z: 0, clone: mockClone }
    })),
    DirectionalLight: jest.fn(() => ({
      position: { set: jest.fn() }
    })),
    AmbientLight: jest.fn(),
    Box3: jest.fn(() => ({
      setFromObject: mockSetFromObject
    })),
    Vector3: jest.fn(() => ({
      x: 0,
      y: 0,
      z: 0
    })),
    Euler: jest.fn(),
  };
});

// Mock Socket.IO
jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
  })),
})); 