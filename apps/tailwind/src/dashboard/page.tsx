import {
  AccessibilityIcon,
  CameraIcon,
  ChevronDownIcon,
  ClockIcon,
  CodeIcon,
  CookieIcon,
  DiscordLogoIcon,
  EnvelopeOpenIcon,
  GearIcon,
  GitHubLogoIcon,
  HomeIcon,
  LinkedInLogoIcon,
  MixerVerticalIcon,
  MobileIcon,
  // App icons
  NotionLogoIcon,
  ReloadIcon,
  RocketIcon,
} from '@radix-ui/react-icons';
import type * as React from 'react';
import {
  Accordion,
  Avatar,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  DropdownMenu,
  Heading,
  IconButton,
  Inset,
  Popover,
  Separator,
  Strong,
  Text,
  TextArea,
  TextField,
  Theme,
  ThemePanel,
  Tooltip,
} from '@aussieljk/frosted';
import { SiteHeader } from '../site-header';

const SidebarButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <button
      className={
        'fui-reset flex items-center text-gray-a10 gap-4 w-full h-[42px] pl-4 rounded-md hover:bg-gray-a3 hover:text-gray-a12 dark:hover:shadow-[0px_0px_0px_1px_var(--gray-a4)_inset] dark:hover:bg-[linear-gradient(_95deg,transparent,transparent,transparent,var(--accent-a4)_)]'
      }
    >
      {children}
    </button>
  );
};
const DashboardCard = () => {
  return (
    <div className="flex-1 relative min-h-[202px] p-6 border border-gray-a3 rounded-lg overflow-hidden bg-panel-solid">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between">
          <div
            className={[
              'relative flex w-[60px] h-[60px] justify-center items-center rounded-[18px] border border-gray-a3 bg-panel-solid',
              "after:content-[''] after:absolute after:inset-[12px] after:border after:border-green-6 after:rounded-3 after:bg-gradient-to-b from-green-a3 to-transparent",
            ].join(' ')}
          />
          <div className="flex flex-col gap-2">
            <Text color="gray" size="1" trim="both">
              <Tooltip content="SWAG" open>
                <Strong>APPS SUPPORTED</Strong>
              </Tooltip>
            </Text>
            <Accordion.Root
              type="multiple"
              // collapsible
              style={{ width: 600 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <Accordion.Item value="item-1">
                  <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
                  <Accordion.Content>Yes. It adheres to the WAI-ARIA design pattern.</Accordion.Content>
                </Accordion.Item>

                <Accordion.Item value="item-2">
                  <Accordion.Trigger>Is it unstyled?</Accordion.Trigger>
                  <Accordion.Content>
                    Yes. It's unstyled by default, giving you freedom over the look and feel.
                  </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item value="item-3">
                  <Accordion.Trigger>Can it be animated?</Accordion.Trigger>
                  <Accordion.Content>Yes! You can animate the Accordion with CSS or JavaScript.</Accordion.Content>
                </Accordion.Item>
              </div>
            </Accordion.Root>
            <div className="flex justify-center gap-1 px-2 py-1 rounded-3 border border-gray-a3">
              <NotionLogoIcon width="20" height="20" className="text-blue-9" />
              <DiscordLogoIcon width="20" height="20" className="text-lime-9" />
              <LinkedInLogoIcon width="20" height="20" className="text-yellow-9" />
              <GitHubLogoIcon width="20" height="20" className="text-red-9" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Heading size="3" trim="both">
            Trading
          </Heading>
          <Text size="2" color="gray" trim="both">
            Choose this to offer access to trading insights, tips, and lessons.
          </Text>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  return (
    <Theme
      id="root"
      className="w-full h-[100vh] bg-gray-1 flex flex-col p-2"
      appearance="dark"
      grayColor="gray"
      accentColor="blue"
    >
      <ThemePanel />
      <SiteHeader />
      <div className="flex flex-1 min-h-0">
        <aside className="h-full w-[300px] py-2 px-4">
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex px-4 py-2">
                <Popover.Root>
                  <Popover.Trigger>
                    <Card variant="ghost" style={{ flex: 1 }} render={<button />}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Avatar fallback="PB" />
                          <Text>Parlay Banditz</Text>
                        </div>
                        <ChevronDownIcon />
                      </div>
                    </Card>
                  </Popover.Trigger>
                  <Popover.Content size="3" style={{ width: 300 }}>
                    <div className="flex gap-3">
                      <Avatar
                        size="3"
                        src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
                        fallback="A"
                      />
                      <div style={{ flexGrow: 1 }}>
                        <TextArea size="2" placeholder="Write a comment…" style={{ height: 80 }} />

                        <div className="flex justify-between items-center gap-3 mt-3">
                          <div className="flex items-center gap-2">
                            <label>
                              <Checkbox size="2" />
                              <Text size="2">Send to group</Text>
                            </label>
                          </div>

                          <Popover.Close>
                            <Button autoFocus size="2">
                              Comment
                            </Button>
                          </Popover.Close>
                        </div>
                      </div>
                    </div>
                  </Popover.Content>
                </Popover.Root>
              </div>
              <div className="flex flex-col gap-1 pt-6">
                <SidebarButton>
                  <HomeIcon width="24" height="24" />
                  Home
                </SidebarButton>
                <SidebarButton>
                  <AccessibilityIcon width="24" height="24" />
                  Products
                </SidebarButton>
                <SidebarButton>
                  <MixerVerticalIcon width="24" height="24" />
                  Product pages
                </SidebarButton>
                <SidebarButton>
                  <EnvelopeOpenIcon width="24" height="24" />
                  Apps
                </SidebarButton>
                <SidebarButton>
                  <CookieIcon width="24" height="24" />
                  Links
                </SidebarButton>
                <SidebarButton>
                  <MobileIcon width="24" height="24" />
                  Customers
                </SidebarButton>
                <SidebarButton>
                  <ReloadIcon width="24" height="24" />
                  Stats
                </SidebarButton>
                <SidebarButton>
                  <RocketIcon width="24" height="24" />
                  Affiliates
                </SidebarButton>
                <SidebarButton>
                  <ClockIcon width="24" height="24" />
                  Payments
                </SidebarButton>
                <SidebarButton>
                  <CodeIcon width="24" height="24" />
                  Feedback
                </SidebarButton>
                <SidebarButton>
                  <CameraIcon width="24" height="24" />
                  Resolution center
                </SidebarButton>
              </div>
            </div>
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-3">
                <Avatar fallback="IM" />
                <Text>Ilya Miskov</Text>
              </div>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <IconButton variant="surface" size="3">
                    <GearIcon width="20" height="20" color="var(--gray-10)" />
                  </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end" size="2">
                  <DropdownMenu.Item>Sign up</DropdownMenu.Item>
                  <DropdownMenu.Item>Log in</DropdownMenu.Item>

                  <DropdownMenu.Separator />

                  <DropdownMenu.Item>Air Cover</DropdownMenu.Item>
                  <DropdownMenu.Item>Cancellations</DropdownMenu.Item>
                  <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger>Hosting</DropdownMenu.SubTrigger>

                    <DropdownMenu.SubContent>
                      <DropdownMenu.Item>Resources</DropdownMenu.Item>
                      <DropdownMenu.Item>Community forum</DropdownMenu.Item>
                      <DropdownMenu.Item>Hosting guide</DropdownMenu.Item>
                      <DropdownMenu.Separator />
                      <DropdownMenu.Item>Your home</DropdownMenu.Item>
                    </DropdownMenu.SubContent>
                  </DropdownMenu.Sub>

                  <DropdownMenu.Separator />

                  <DropdownMenu.Item>Help Centre</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </div>
          </div>
        </aside>
        <main className="h-full flex-1 rounded-5 border border-solid border-gray-a4 dark:bg-[rgba(255,255,255,0.01)]">
          <div className="px-[54px] pr-12">
            <div className="flex flex-row items-center justify-between py-4">
              <div>
                <Breadcrumbs.Root>
                  <Breadcrumbs.Item>PRODUCTS</Breadcrumbs.Item>
                  <Breadcrumbs.Item>PICK A CATEGORY</Breadcrumbs.Item>
                </Breadcrumbs.Root>
              </div>
              <div>
                <div className="flex items-center gap-4">
                  <TextField.Root>
                    <TextField.Input placeholder="Search" type="search" size="3" />
                  </TextField.Root>
                  <Separator orientation="vertical" />
                  <div className="flex items-center gap-4">
                    <IconButton variant="ghost" color="gray" size="3">
                      <CookieIcon width="20" height="20" />
                    </IconButton>
                    <IconButton variant="ghost" color="gray" size="3">
                      <EnvelopeOpenIcon width="20" height="20" />
                    </IconButton>
                    <IconButton variant="ghost" color="gray" size="3">
                      <MixerVerticalIcon width="20" height="20" />
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between pb-7">
              <div>
                <div className="flex flex-col gap-2">
                  <Heading
                    size="8"
                    style={{
                      fontFeatureSettings: `'liga' 1, 'calt' 1`,
                    }}
                  >
                    {"Choose what you're selling ->"}
                  </Heading>
                  <Text color="gray">Choose what you're selling</Text>
                </div>
              </div>
              <div>
                <Card variant="surface">
                  <Inset>
                    <div className="px-3 py-2">
                      <Breadcrumbs.Root>
                        <Breadcrumbs.Item>Pick category</Breadcrumbs.Item>
                        <Breadcrumbs.Item>Add an app</Breadcrumbs.Item>
                        <Breadcrumbs.Item>Add price</Breadcrumbs.Item>
                      </Breadcrumbs.Root>
                    </div>
                  </Inset>
                </Card>
              </div>
            </div>
            <Separator size="4" />
            <div className="flex flex-col gap-9">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Heading size="4">Recommended for you</Heading>
                  <Text size="2" color="gray">
                    Our most popular picks
                  </Text>
                </div>
                <div className="flex gap-4">
                  <DashboardCard />
                  <div className="flex-1" />
                  <div className="flex-1" />
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Heading size="4">All categories</Heading>
                  <Text size="2" color="gray">
                    Our most popular picks
                  </Text>
                </div>
                <div className="flex gap-4">
                  <DashboardCard />
                  <DashboardCard />
                  <DashboardCard />
                </div>
              </div>
            </div>
            <div className="flex mt-8">
              <Button variant="soft" color="gray" className="w-full" size="4">
                Load more
              </Button>
            </div>
          </div>
        </main>
      </div>
    </Theme>
  );
}
