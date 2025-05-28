import ManageOrganization from "../../components/admin/organizations/ManageOrganization";

const OrganizationsManagePage = () => {
  return (
    <div className='space-y-4'>
      <h2 className='text-gray-700 text-xl font-semibold mb-4'>조직 관리</h2>
      <ManageOrganization />
    </div>
  );
};

export default OrganizationsManagePage;
