interface PopUpMenuProps {
  items: { id: number; name: string }[];
}

const PopUpMenu: React.FC<PopUpMenuProps> = ({ items }) => {
  return (
    <ul className='bg-white shadow-lg rounded-lg py-2 px-3 text-black relative z-50 right-0 top-0 flex flex-col'>
      {items.map((item) => (
        <li
          key={item.id}
          className='px-3 py-2 hover:bg-primary/10 cursor-pointer rounded transition-colors duration-150 text-left'
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
};

export default PopUpMenu;
