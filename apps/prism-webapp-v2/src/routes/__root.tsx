import { Outlet, createRootRoute, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'

export const Route = createRootRoute({

  component: RootApp,
  beforeLoad: async({ location }) =>{
    if(localStorage.getItem('user-token')){
      throw redirect({
        to: "/auth/login",
        search: location.href
      })
    }
  }
})

function RootApp (){
  //checking to verify if there is a valid token in the localstorage
  const userToken = localStorage.getItem("user-token");

  return <>
    <Outlet />
    <TanstackDevtools
      config={{
        position: 'bottom-left',
      }}
      plugins={[
        {
          name: 'Tanstack Router',
          render: <TanStackRouterDevtoolsPanel />,
        },
      ]}
    />
  </>
}
