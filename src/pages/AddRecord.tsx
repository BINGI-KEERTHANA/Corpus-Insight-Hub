import AddRecord from "../pages/AddRecord/AddRecord";

<Route
  path="/add-record"
  element={
    <ProtectedRoute>
      <Layout>
        <AddRecord />
      </Layout>
    </ProtectedRoute>
  }
/>