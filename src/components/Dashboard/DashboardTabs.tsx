import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateProduct from "./Create/CreateProduct";
import Products from "./Products";

const DashboardTabs = () => {
  return (
    <div>
      <Tabs defaultValue="products" className="">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <Products />
        </TabsContent>
        <TabsContent value="create">
          <CreateProduct />
        </TabsContent>
        <TabsContent value="settings">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};
export default DashboardTabs;
