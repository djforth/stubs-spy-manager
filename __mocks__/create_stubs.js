const CreateStubs = jest.genMockFromModule('src/utils/create_stubs');

let reset_stubs = jest.fn('reset_stubs');
let create_stubs = jest.fn('create_stubs');
create_stubs.mockReturnValue(reset_stubs);

export default ()=>create_stubs;

// export const GetSpies = ()=>Object({
//   create_stubs
//   , reset_stubs
// })