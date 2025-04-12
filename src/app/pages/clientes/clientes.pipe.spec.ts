import { ClientesPipe } from './clientes.pipe';

describe('ClientesPipe', () => {
  it('create an instance', () => {
    const pipe = new ClientesPipe();
    expect(pipe).toBeTruthy();
  });
});
